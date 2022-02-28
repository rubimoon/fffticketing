import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

class DbHandler {
  private _database?: MongoMemoryServer;
  get database() {
    if (!this._database) {
      throw new Error(
        'Cannot access mongo memory server before creating a instance.'
      );
    }
    return this._database;
  }

  createDb = async () => {
    this._database = await MongoMemoryServer.create();
  };

  connectDb = async () => {
    const uri = this.database.getUri();
    await mongoose.connect(uri);
  };

  cleanupDb = async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  };

  dropDb = async () => {
    await this.database.stop();
    await mongoose.connection.close();
  };
}

export const dbHandler = new DbHandler();
