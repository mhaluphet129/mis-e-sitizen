import Notification from "../../database/model/Notitification";
import dbConnect from "../../database/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "GET":
      return new Promise(async (resolve, reject) => {
        try {
          const { id } = req.query;
          let notification = await Notification.find({
            adminId: id,
            type: "notification",
          }).sort({ createdAt: -1 });
          let announcement = await Notification.find({
            type: "annoucement",
          }).sort({ createdAt: -1 });

          return res.json({
            status: 200,
            success: true,
            notification,
            announcement,
            message: "Successfully submitted announcement",
          });
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Error: " + err });
        }
      });
    case "POST": {
      return new Promise(async (resolve, reject) => {
        const { mode } = req.body.payload;
        switch (mode) {
          case "announce": {
            const { title, content } = req.body.payload;
            return await Notification.create({
              title,
              content,
              type: "annoucement",
            })
              .then(() => {
                return res.json({
                  status: 200,
                  success: true,
                  message: "Successfully submitted announcement",
                });
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ success: false, message: "Error: " + err });
              });
          }
          case "seen-push": {
            let { id, notifId } = req.body.payload;

            if (typeof notifId == "object") {
              return await Notification.updateMany(
                { _id: { $in: notifId } },
                { $set: { isSeen: true } }
              )
                .then(() => {
                  return res.json({ success: true });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ success: false, message: "Error: " + err });
                });
            } else {
              return await Notification.findOneAndUpdate(
                { _id: notifId },
                { $push: { seenBy: id }, $set: { isSeen: true } }
              )
                .then(() => {
                  return res.json({ success: true });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ success: false, message: "Error: " + err });
                });
            }
          }

          case "seen-push-all": {
            let { id, notifIds } = req.body.payload;

            return await Notification.updateMany(
              { _id: { $in: notifIds } },
              { $push: { seenBy: id } }
            )
              .then(() => {
                return res.json({ success: true });
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
