import Senior from "../../database/model/Senior";
import dbConnect from "../../database/dbConnect";
import Admin from "../../database/model/Admin";

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
              let seniors = await Senior.find(
                req.query.hasOwnProperty("barangay")
                  ? { barangay: req.query.barangay }
                  : {}
              );
              res.json({ status: 200, data: { seniors } });
              resolve();
            } catch {
              res.status(500).json({ message: "Error in the server." });
            }
          }
          case "check-admin-exist": {
            return await Admin.find({ role: "superadmin" })
              .then((data) => {
                res.json({ status: 200, message: "Fetch done.", data });
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
          case "init": {
            let initAdmin = Admin({
              name: "e-sitizen",
              lastname: "ADMIN",
              email: "admin",
              role: "superadmin",
              password: "1234",
            });

            return initAdmin
              .save()
              .then(() => {
                res.json({
                  status: 200,
                  message: "Init admin creation success",
                });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
                reject();
              });
          }
        }
      });
    }
    default:
      res.status(400).json({ success: false });
  }
}
