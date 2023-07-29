import Senior from "../../database/model/Senior";
import dbConnect from "../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      return new Promise(async (resolve, reject) => {
        const { mode } = req.query;

        switch (mode) {
          case "fetch-all": {
            const { search, barangay } = req.query;
            let query = {};
            if (barangay) query.barangay = barangay;
            if (!["", undefined].includes(req.query.search)) {
              query._id = search;
              return await Senior.find(query).then((e) => {
                res.json({
                  status: 200,
                  message: "Successfully fetched the data",
                  senior: e,
                });
                resolve();
              });
            } else {
              return await Senior.find(query).then((e) => {
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
                { "name.lastname": { $regex: re } },
                { "name.name": { $regex: re } },
                { "name.middlename": { $regex: re } },
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
            if (_.hasOwnProperty("withSSS"))
              option.push({ "pensionStatus.withSSS": _.withSSS });
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
          case "search-senior-by-id": {
            const { _id } = req.query;
            return await Senior.findOne({ _id })
              .then((e) => {
                res.json({ status: 200, data: e });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
                resolve();
              });
          }
          case "dash-card": {
            let query = {};

            switch (req.query?.filter) {
              case "withPension": {
                query = { "pensionStatus.withPension": true };
                break;
              }
              case "withoutPension": {
                query = { "pensionStatus.withPension": false };
                break;
              }
              case "male": {
                query = { gender: "male" };
                break;
              }
              case "female": {
                query = { gender: "female" };
                break;
              }
            }

            await Senior.find(query)
              .then((e) => {
                res.json({ status: 200, data: e });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }

          case "check-exist": {
            return await Senior.findOne({
              $and: [
                { "name.name": req.query.name },
                { "name.lastname": req.query.lastname },
              ],
            })
              .then((doc) => {
                if (doc == null) res.json({ status: 201 });
                else res.json({ status: 200 });

                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }

          case "get-senior-with-history": {
            return await Senior.aggregate([
              {
                $match: {
                  _id: mongoose.Types.ObjectId(req.query.id),
                },
              },
              {
                $lookup: {
                  from: "histories",
                  localField: "history",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $sort: {
                        createdAt: -1,
                      },
                    },
                  ],
                  as: "history",
                },
              },
              {
                $project: {
                  _id: 0,
                  history: 1,
                  name: 1,
                },
              },
            ])
              .then((e) => {
                res.json({ status: 200, data: e[0] });
                resolve();
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }

          case "update-status": {
            const { id, status } = req.query;
            console.log(req.query);
            return await Senior.findOneAndUpdate(
              { _id: id },
              { $set: { status } }
            )
              .then(() => {
                res.json({ status: 200 });
                resolve();
              })
              .catch(() => {
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

          case "delete-senior": {
            const { _id } = req.body.payload;

            return await Senior.findOneAndDelete({ _id })
              .then(() => {
                res.json({ status: 200, message: "Successfully deleted" });
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
