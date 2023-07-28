import Senior from "../../database/model/Senior";
import Admin from "../../database/model/Admin";
import dbConnect from "../../database/dbConnect";

import json from "../assets/json/constant.json";

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

          case "barangay-admin": {
            return await Admin.find({ role: "admin" }).then((docs) => {
              let barangay = json.barangay.map((e) => {
                return { name: e, status: false };
              });
              docs.forEach((e) => {
                const index = barangay.map((_) => _.name).indexOf(e?.barangay);
                barangay[index].status = true;
              });

              res.json({ success: true, barangay });
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
