import { connect, ObjectId } from "../../../utils/database";
// import { connect, ObjectId } from "../../../utils/fakeDatabase";

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;
  const collectionName = "pens";
  switch (method) {
    case "GET":
      try {
        const { db } = await connect();
        const data = await db
          .collection(collectionName)
          .findOne({ _id: ObjectId(id) });
        if (!data) {
          res.status(404).json({ success: false });
        }
        res.status(200).json({ data });
      } catch (error) {
        res.status(500).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const { html, css, js } = req.body;
        const { db } = await connect();

        const result = await db.collection(collectionName).insertOne({
          html,
          css,
          js,
        });
        res
          .status(200)
          .json({ success: true, data: { newRecordId: result.insertedId } });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { html, css, js, id } = req.body;
        const { db } = await connect();

        await db
          .collection(collectionName)
          .updateOne(
            { _id: ObjectId(id) },
            { $set: { html: html, css: css, js: js } }
          );
        res
          .status(200)
          .json({ success: true, data: { updatedRecord: true } });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false, data: "default" });
      break;
  }
};
