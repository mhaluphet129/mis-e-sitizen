import Senior from "../../database/model/Senior";
import Notification from "../../database/model/Notitification";
import Admin from "../../database/model/Admin";
import dbConnect from "../../database/dbConnect";
import mongoose from "mongoose";
import dayjs from "dayjs";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      return new Promise(async (resolve, reject) => {
        const { mode } = req.query;

        switch (mode) {
          case "fetch-all": {
            let { search, barangay, date, selectedDates } = req.query;
            let query = { $expr: { $and: [] } };

            if (date) date = JSON.parse(date);
            if (selectedDates) selectedDates = JSON.parse(selectedDates);
            if (barangay) query.$and = [{ barangay }];
            if (date) {
              if (date.year) {
                query.$expr.$and.push({
                  $eq: [{ $year: "$createdAt" }, parseInt(date.year)],
                });

                if (date.month) {
                  query.$expr.$and.push({
                    $and: [
                      {
                        $eq: [
                          { $month: "$createdAt" },
                          parseInt(date.month) + 1,
                        ],
                      },
                    ],
                  });

                  if (date.day) {
                    query.$expr.$and.push({
                      $eq: [{ $dayOfMonth: "$createdAt" }, parseInt(date.day)],
                    });
                  }
                }
              }
            }
            if (selectedDates && selectedDates?.length != 0) {
              query.$expr.$and.push({
                $gte: ["$createdAt", new Date(selectedDates[0])],
              });
              query.$expr.$and.push({
                $lt: ["$createdAt", new Date(selectedDates[1])],
              });
            }

            if (search) query.$expr.$and.push({ _id: search });

            if (query.$expr.$and.length == 0) delete query.$expr;

            return await Senior.find(query)
              .sort({ barangay: 1, "name.lastname": 1 })
              .then((e) => {
                res.json({
                  status: 200,
                  message: "Successfully fetched the data",
                  senior: e,
                });
                resolve();
              });
          }
          case "search-senior": {
            const { searchKeyword } = req.query;
            var re = new RegExp(searchKeyword.toLowerCase().trim(), "i");

            return await Senior.find({
              $and: [
                {
                  $or: [
                    { "name.lastname": { $regex: re } },
                    { "name.name": { $regex: re } },
                    { "name.middlename": { $regex: re } },
                    { "name.id": { $regex: re } },
                    { barangay: { $regex: re } },
                  ],
                },
                {
                  isArchived: false,
                },
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
            if (_.hasOwnProperty("pensionerType"))
              option.push({ pensionerType: _.pensionerType });
            if (_.hasOwnProperty("address"))
              option.push({ barangay: { $in: [..._.address] } });
            if (_.hasOwnProperty("status"))
              option.push({ status: { $in: [..._.status] } });
            if (_.hasOwnProperty("ageRange"))
              option.push({
                $expr: {
                  $and: [
                    {
                      $gte: [
                        {
                          $toDouble: {
                            $subtract: [
                              new Date(),
                              { $toDate: "$dateOfBirth" },
                            ],
                          },
                        },
                        _.ageRange.from * 365 * 24 * 60 * 60 * 1000,
                      ],
                    },
                    {
                      $lt: [
                        {
                          $toDouble: {
                            $subtract: [
                              new Date(),
                              { $toDate: "$dateOfBirth" },
                            ],
                          },
                        },
                        _.ageRange.to * 365 * 24 * 60 * 60 * 1000,
                      ],
                    },
                  ],
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
              case "social": {
                query = { pensionerType: "social" };
                break;
              }
              case "private": {
                query = { pensionerType: "private" };
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

            if (req.query.barangay != null) query.barangay = req.query.barangay;

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

          case "senior-with-filter": {
            let { status, barangay, pstatus, year, semester } = req.query;
            if (status != "" && status != null) status = JSON.parse(status);
            if (pstatus != "" && pstatus != null) pstatus = JSON.parse(pstatus);
            let filter = [];

            if (barangay != null)
              filter.push({
                $match: {
                  barangay,
                },
              });

            if (status != null && status?.length != 0) {
              filter.push({
                $match: {
                  status: {
                    $in: status,
                  },
                },
              });
            }

            if (pstatus != null && pstatus?.length != 0) {
              filter.push({
                $match: {
                  pensionerType: {
                    $in: pstatus,
                  },
                },
              });
            }

            if (year != undefined || semester != undefined) {
              let _q = {};
              if (year != undefined)
                _q = {
                  $match: {
                    $expr: {
                      $eq: [{ $year: "$createdAt" }, parseInt(year)],
                    },
                  },
                };

              if (semester != undefined) {
                if (Object.keys(_q).length == 0) {
                  _q = {
                    $match: {
                      semester: { $in: [semester] },
                    },
                  };
                } else {
                  _q.$match.semester = { $in: [semester] };
                }
              }

              filter.push({
                $lookup: {
                  from: "histories",
                  localField: "history",
                  foreignField: "_id",
                  pipeline: [_q],
                  as: "history",
                },
              });
              filter.push({
                $match: {
                  history: { $ne: [] },
                },
              });
            }

            return await Senior.aggregate(filter)
              .then((doc) => {
                res.json({
                  status: 200,
                  senior: doc,
                  message: "Generated Successfully",
                });
                resolve();
              })
              .catch((err) => {
                console.log(err);
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
                reject();
              });
          }

          case "check-id": {
            let { id } = req.query;
            return await Senior.find({ "name.id": id }).then((doc) => {
              if (doc.length > 0) {
                res.json({
                  success: true,
                });
                resolve();
              } else {
                res.json({
                  success: false,
                });
                resolve();
              }
            });
          }
        }
      });
    case "POST": {
      return new Promise(async (resolve, reject) => {
        const { mode } = req.body.payload;

        switch (mode) {
          case "add-senior": {
            let id = req.body.payload.senior?.name?.id ?? "";

            return await new Promise(async (resolve, reject) => {
              let found = await Senior.find({ "name.id": id });

              if (found && found?.length > 0) {
                return res.json({
                  status: 404,
                  success: false,
                  message: "Duplicated Id found",
                });
              } else resolve();
            }).then(async () => {
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
            });
          }
          case "update-senior": {
            const { id, data } = req.body.payload;
            const { receivedPension6mos } = data;

            delete req.body.payload.data._id;
            delete req.body.payload.data.createdAt;
            delete req.body.payload.data.updatedAt;
            delete req.body.payload.data.__v;

            if (receivedPension6mos == "dswd")
              req.body.payload.data.pensionerType = "social";
            else if (receivedPension6mos == "none")
              req.body.payload.data.pensionerType = "none";
            else req.body.payload.data.pensionerType = "private";

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

          case "archive-senior": {
            let { seniorId, updaterId } = req.body.payload;

            let updater = await Admin.findOne({ _id: updaterId });

            let isSuperAdmin = updater.role == "superadmin";

            return await Senior.findOneAndUpdate(
              { _id: seniorId },
              { $set: { isArchived: true } },
              { returnOriginal: false }
            ).then(async (doc) => {
              let placeholder = {
                title: "Senior Archived",
                content: `${doc.name.name} ${doc.name.lastname} has been archived by Super Admin`,
                type: "notification",
              };

              if (isSuperAdmin) {
                let admin = await Admin.findOne({
                  barangay: doc.barangay,
                }).select("_id");

                if (admin) {
                  await Notification.create({
                    ...placeholder,
                    adminId: admin._id,
                  });
                }
              }

              await Notification.create({
                ...placeholder,
                adminId: updaterId,
                content: `You archived ${doc.name.name} ${doc.name.lastname}`,
              });

              return res.json({
                status: 200,
                success: true,
                message: "Successfully Archived the senior",
              });
            });
          }

          case "transfer-senior": {
            let { barangay, seniorId, transferBy } = req.body.payload;

            return await Senior.findOneAndUpdate(
              { _id: seniorId },
              { $set: { barangay } },
              { returnOriginal: false }
            )
              .then(async (doc) => {
                //* notify transferer
                await Notification.create({
                  title: "Transfered Senior",
                  content: `${doc.name.name} ${doc.name.lastname} has been transfered to Barangay ${barangay}`,
                  type: "notification",
                  adminId: transferBy,
                });

                //* notify transfered to
                let admin = await Admin.findOne({
                  barangay: doc.barangay,
                }).select("_id");

                if (admin) {
                  await Notification.create({
                    title: "Transfered Senior",
                    content: `Senior Citizen ${doc.name.name} ${doc.name.lastname} has been transfered to you.`,
                    type: "notification",
                    adminId: admin._id,
                  });
                }

                return res.json({
                  status: 200,
                  success: true,
                  message: "Successfully transfered the senior",
                });
              })
              .catch((err) => {
                console.log(err);
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
