import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
// eslint-disable-next-line max-len
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { orderBy } from 'lodash';

import logger from './logger';
import config from './config';

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/globals.html
// Set the AWS Region.
const REGION = config.get('aws.region');
const bucketName = config.get('aws.bucket');
// IDENTITY_POOL_ID e.g., eu-west-1:xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx
const identityPoolId = config.get('aws.identityPoolId');

// Create an Amazon S3 service client object.
export const s3Client = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId,
  }),
});

const generateFileUrl = (fileKey) => {
  const href = `https://s3.${REGION}.amazonaws.com/`;
  const bucketUrl = `${href + bucketName}/`;
  const fileUrl = bucketUrl + encodeURIComponent(fileKey);
  return fileUrl;
};

// https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
export const generateSignedUrl = async ({ fileKey, fileType }) => {
  const uploadParams = {
    Bucket: bucketName,
    Key: fileKey,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(uploadParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    signedUrl: url,
    fileUrl: generateFileUrl(fileKey),
  };
};

const toTimestamp = (strDate) => {
  const datum = Date.parse(strDate);
  return datum / 1000;
};

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-photos-view.html
export const fetchFiles = async (albumName = 'featured') => {
  const albumPhotosKey = `${encodeURIComponent(albumName)}/`;
  const data2 = await s3Client.send(
    new ListObjectsCommand({
      Prefix: albumPhotosKey,
      Bucket: bucketName,
      MaxKeys: 1000,
    }),
  );
  // console.log('data', data2);

  const data = data2.Contents.map((item) => {
    // console.log('item', item);
    const photoKey = item.Key;
    const photoUrl = generateFileUrl(photoKey);
    // console.log('photoKey', photoKey);
    if (photoKey !== `${albumName}/`) {
      return {
        id: item.ETag,
        fileName: photoKey,
        filePath: photoUrl,
        uploadedOn: String(item.LastModified),
        timestamp: toTimestamp(item.LastModified),
        // content: fileContents,
      };
    }
    return null;
  });

  // console.log('data', data);
  const sortedData = orderBy(data, ['timestamp'], ['desc']);
  // console.log('sortedData', sortedData);
  return sortedData;
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectcommand.html
export const removeFile = async (file) => {
  try {
    const data = await s3Client.send(
      new DeleteObjectCommand({
        // Prefix: albumPhotosKey,
        Bucket: bucketName,
        Key: file,
      }),
    );
    logger.info('File removed', data);

    return true;
  } catch (e) {
    logger.log('error', 'removeFile failed', e.message);
    throw new Error(e.message);
  }
};
