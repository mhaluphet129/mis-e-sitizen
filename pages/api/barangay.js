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
                let admin = await Admin.findOne({
                  role: "barangay-admin",
                  barangay,
                });
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

          case "fetch-senior-specific": {
            var re = new RegExp(req.query.searchKeyword.trim(), "i");
            return await Admin.find({
              $and: [
                {
                  role: "barangay-admin",
                },
                {
                  $or: [
                    { name: { $regex: re } },
                    { lastname: { $regex: re } },
                    { email: { $regex: re } },
                  ],
                },
              ],
            })
              .then((doc) => {
                res.json({
                  status: 200,
                  data: doc,
                });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }

          case "check-and-add-admin": {
            let { id, barangay } = req.query;

            return await Admin.findOne({ _id: id })
              .then(async (doc) => {
                if (doc != null) {
                  if (![null, "", undefined, "false"].includes(doc?.barangay)) {
                    res.json({
                      status: 201,
                      message: `Admin is already assign in barangay ${doc.barangay}`,
                    });
                    resolve();
                  } else {
                    return await Admin.findOneAndUpdate(
                      { _id: id },
                      { $set: { barangay } }
                    ).then(() => {
                      res.json({
                        status: 200,
                        message: `Successfully added`,
                      });
                      resolve();
                    });
                  }
                } else {
                  res.json({
                    status: 404,
                    message: `Admin not found`,
                  });
                  resolve();
                }
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }

          case "barangay-admin": {
            return await Admin.find({ role: "barangay-admin" }).then((docs) => {
              let barangay = json.barangay.map((e) => {
                return { name: e, status: false };
              });
              docs.forEach((e) => {
                const index = barangay.map((_) => _.name).indexOf(e?.barangay);
                if (index > -1) barangay[index].status = true;
              });

              res.json({ success: true, barangay });
            });
          }

          case "remove-admin": {
            return await Admin.findOneAndUpdate(
              { _id: req.query.id },
              { $set: { barangay: false } }
            )
              .then(() => {
                res.json({
                  status: 200,
                  message: `Remove successfully`,
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
