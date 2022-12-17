import Senior from "../../database/model/Senior";
import dbConnect from "../../database/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      return new Promise(async (resolve, reject) => {
        const { mode } = req.query;

        switch (mode) {
          case "dashboard-data": {
            try {
              let seniors = await Senior.find();
              res.json({ status: 200, data: { barangay: 0, seniors } });
              resolve();
            } catch {
              res.status(500).json({ message: "Error in the server." });
            }
          }
        }
      });
    case "POST": {
      return new Promise(async (resolve, reject) => {
        const { mode } = req.body.payload;

        switch (mode) {
        }
      });
    }
    default:
      res.status(400).json({ success: false });
  }
}
