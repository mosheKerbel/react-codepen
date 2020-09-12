import { MongoClient, ObjectId } from "mongo-mock";

async function connect() {
  const db = await MongoClient.connect("mongodb://mocked-database");
  const collection = await db.createCollection("pens");

  return {db , collection};
}

export { connect, ObjectId };
