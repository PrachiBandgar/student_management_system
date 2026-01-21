import { MongoClient, ObjectId } from "mongodb";
import fs from "fs";

const uri = "mongodb://localhost:27017";
const dbName = "sms";

function parseMongoIds(data) {
  return data.map(item => {
    const obj = { ...item };

    if (obj._id?.$oid) obj._id = new ObjectId(obj._id.$oid);
    if (obj.courseId) obj.courseId = new ObjectId(obj.courseId);
    if (obj.assignmentId) obj.assignmentId = new ObjectId(obj.assignmentId);

    return obj;
  });
}

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const collections = ["courses", "assignments", "submissions"];

  for (const name of collections) {
    const raw = JSON.parse(
      fs.readFileSync(`seed-data/${name}.json`, "utf-8")
    );
    const data = parseMongoIds(raw);

    await db.collection(name).deleteMany({});
    if (data.length) {
      await db.collection(name).insertMany(data);
    }
  }

  console.log("✅ Database seeded successfully");
  process.exit();
}

seed();
