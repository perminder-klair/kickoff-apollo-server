import mongoose from 'mongoose';

import config from './config';

const uri = config.get('mongodb');

mongoose.connection
  .on('error', (e) => console.error('Database connection error', e.message))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(
      `Connected via Mongoose to ${info.host}:${info.port}/${info.name}`,
    );
  });

const moduleLoadedAt = new Date();
console.log('Mongoose initial connection, first attempt....');

let connectionCount = 0;
let connectionPromise = mongoose
  .connect(uri)
  .catch(() => {
    console.log('Mongoose initial connection retry 1');
    return mongoose.connect(uri);
  })
  .catch(() => {
    console.log('Mongoose initial connection retry 2');
    return mongoose.connect(uri);
  })
  .catch(() => {
    console.log('Mongoose initial connection retry 3');
    return mongoose.connect(uri);
  })
  .catch(() => {
    console.log('Mongoose initial connection retry 4');
    return mongoose.connect(uri);
  })
  .catch(() => {
    console.log('Mongoose initial connection retry 5');
    return mongoose.connect(uri);
  });

function reconnect() {
  connectionCount += 1;
  console.log(
    `Database reconnection count ${connectionCount} for this instance`,
  );
  connectionPromise = mongoose.connect(uri);
}

let usageCount = 0;

async function connectDatabase() {
  const dbState = mongoose.STATES[mongoose.connection.readyState];
  console.log(
    'Usage count for this instance is',
    usageCount,
    'state is',
    dbState,
    'module loaded',
    new Date() - moduleLoadedAt,
    'ms ago',
  );
  usageCount += 1;
  try {
    await connectionPromise;
    if (dbState === 'disconnected' || dbState === 'disconnecting') {
      console.log('Database has disconnected, starting new connection ....');
      throw new Error('Database disconnected');
    }
  } catch {
    reconnect();
    console.log('Number of connections:', mongoose.connections.length);
  }
  return connectionPromise;
}

export default connectDatabase;
