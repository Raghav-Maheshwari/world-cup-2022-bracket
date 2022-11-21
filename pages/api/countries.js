import { setupDb } from "../../lib/setup-db";

export default async (req, res) => {
  try {
    const db = await setupDb();

    const countries = await db.collection('countries')
      .find()
      .toArray();

    res.status(200).json(countries);
  } catch (e) {
    res.json({ e: e.message });
  }
}