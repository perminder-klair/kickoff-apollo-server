import { find } from 'lodash';

const data = [
  {
    id: 1,
    title: 'My First Post',
    slug: 'my-first-post',
    body: '### This is best post ever 1',
    createdAt: '11/12/2020',
  },
  {
    id: 2,
    title: 'My Second Post',
    slug: 'my-second-post',
    body: '### This is best post ever 2',
    createdAt: '11/12/2020',
  },
  {
    id: 3,
    title: 'My Third Post',
    slug: 'my-third-post',
    body: '### This is best post ever 3',
    createdAt: '11/12/2020',
  },
];

export default {
  Query: {
    allPosts: () => data,
    singlePost: (root, args) => find(data, { slug: args.slug }),
  },
};
