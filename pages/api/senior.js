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
          case "fetch-all": {
            if (req.query.search != "") {
              const { search } = req.query;
              return await Senior.find({ _id: search }).then((e) => {
                res.json({
                  status: 200,
                  message: "Successfully fetched the data",
                  senior: e,
                });
                resolve();
              });
            } else {
              return await Senior.find().then((e) => {
                res.json({
                  status: 200,
                  message: "Successfully fetched the data",
                  senior: e,
                });
                resolve();
              });
            }
          }
          case "search-senior": {
            const { searchKeyword } = req.query;
            var re = new RegExp(searchKeyword.trim(), "i");

            return await Senior.find({
              $or: [
                { lastname: { $regex: re } },
                { name: { $regex: re } },
                { middlename: { $regex: re } },
              ],
            })
              .collation({ locale: "en" })
              .sort({ name: 1 })
              .then((e) => {
                res.json({ status: 200, searchData: e });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }
          case "filter-senior": {
            const { filter } = req.query;
            let _ = JSON.parse(filter);

            let option = [];

            if (_.hasOwnProperty("gender")) option.push({ gender: _.gender });
            if (_.hasOwnProperty("withPension"))
              option.push({ "pensionStatus.withPension": _.withPension });
            if (_.hasOwnProperty("address"))
              option.push({ address: _.address });
            if (_.hasOwnProperty("status"))
              option.push({ status: { $in: [..._.status] } });
            if (_.hasOwnProperty("ageRange"))
              option.push({
                age: {
                  $gte: _.ageRange.from,
                  $lte: _.ageRange.to,
                },
              });
            await Senior.find({ $and: [...option] })
              .then((e) => {
                res.json({ status: 200, searchData: e });
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
            resolve();
          }
        }
      });
    case "POST": {
      return new Promise(async (resolve, reject) => {
        const { mode } = req.body.payload;

        switch (mode) {
          case "add-senior": {
            let newSenior = Senior(req.body.payload.senior);

            return await newSenior
              .save()
              .then(() => {
                res.json({ status: 200, message: "Successfully Added" });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }
          case "update-senior": {
            const { id } = req.body.payload;

            delete req.body.payload.data._id;
            delete req.body.payload.data.createdAt;
            delete req.body.payload.data.updatedAt;
            delete req.body.payload.data.__v;

            console.log(req.body.payload);
            return await Senior.findOneAndUpdate(
              { _id: id },
              { $set: { ...req.body.payload.data } }
            )
              .then(() => {
                res.json({ status: 200, message: "Successfully updated" });
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
    }
    default:
      res.status(400).json({ success: false });
  }
}