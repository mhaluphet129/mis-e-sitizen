import History from "../../database/model/History";
import Senior from "../../database/model/Senior";
import dbConnect from "../../database/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "GET":
      return new Promise(async (resolve, reject) => {
        resolve();
      });
    case "POST": {
      return new Promise(async (resolve, reject) => {
        const { mode } = req.body.payload;
        switch (mode) {
          case "add-history": {
            let { name, lastname } = JSON.parse(req.cookies.currentUser);
            const { id, amount, note, authorizedName } = req.body.payload;
            let _history = History({
              amount,
              note,
              employerName: name + " " + lastname,
            });

            if (authorizedName) _history.name = authorizedName;

            return await _history.save().then(async () => {
              return await Senior.findOneAndUpdate(
                { _id: id },
                { $push: { history: _history._id } }
              )
                .then((e) => {
                  res.json({
                    status: 200,
                    message: "Successfully added history",
                  });
                  resolve();
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ success: false, message: "Error: " + err });
                });
            });
          }
        }
      });
    }
    default:
      res.status(400).json({ success: false });
  }
}
