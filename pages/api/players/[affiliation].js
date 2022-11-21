import { setupDb } from "../../../lib/setup-db";

export default async (req, res) => {
  try {
    const db = await setupDb();
    const { affiliation } = req.query;

    const players = await db.collection('players').aggregate(
      [
        {
          $lookup: {
            from: "countries",
            localField: "picks",
            foreignField: "name",
            as: "picks"
          }
        },
        {
          $match: {
            affiliation: {
              $eq: affiliation
            }
          }
        }
      ]
    ).toArray();

    const lastUpdatedAt = await db.collection('last-updated')
      .findOne();

    res.status(200).json({ players, lastUpdatedAt });
  } catch (e) {
    res.json({ e: e.message });
  }  
  

}