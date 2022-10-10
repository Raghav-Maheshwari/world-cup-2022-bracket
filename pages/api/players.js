import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("world-cup-2022-bracket-db");

    const players = await db
      .collection('players')
      .find({})
      .toArray();

      res.json(players);
  } catch (e) {
      res.json({ error: e });
  }
}