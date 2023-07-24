import Senior from "../../database/model/Senior";
import Admin from "../../database/model/Admin";
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
              let pieData = await Senior.aggregate([
                {
                  $group: {
                    _id: "$barangay",
                    count: { $sum: 1 },
                  },
                },
              ]);
              let totalSenior = await Senior.countDocuments();
              res.json({
                status: 200,
                data: { pieData, totalSenior },
              });
              resolve();
            } catch {
              res
                .status(500)
                .json({ success: false, message: "Error: " + err });
            }
          }

          case "fetch-seniors": {
            let { barangay } = req.query;

            return await Senior.find({ barangay })
              .then(async (doc) => {
                // get the current admin
                let admin = await Admin.findOne({ role: "admin", barangay });
                res.json({
                  status: 200,
                  data: doc,
                  admin,
                });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
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
