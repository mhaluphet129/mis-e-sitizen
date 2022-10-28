import dbConnect from "../../database/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
}
