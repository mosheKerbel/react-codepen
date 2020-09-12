import { MongoClient, ObjectId } from "mongodb";

const dbName = "db-name";
const url = `mongodb+srv://your-username:your-password@cluster0.ldrfm.mongodb.net/db-name?retryWrites=true&w=majority`;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  if (!client.isConnected()) await client.connect();
  const db = client.db(dbName);
  return { db, client };
}

export { connect, ObjectId };
