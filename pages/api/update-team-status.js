import { setupDb } from "../../lib/setup-db";

export default async (req, res) => {
  try {
    const db = await setupDb();

    const countries = await db.collection('countries')
      .find()
      .toArray();

    for (const country of countries) {
      const { country_code } = country;

      const countryApiResponse = await fetch(`https://worldcupjson.net/teams/${country_code}`);

      const countryData = await countryApiResponse.json();
      
      if (!countryData.next_match) {
        // this country doesn't have a next match to play, so we assume they are eliminated from the tournament
        await db.collection('countries').updateOne(
          { country_code: country_code },
          {
            $set: {
              eliminated: true
            }
          }
        )
      }
    }

    res.status(200).json({ success: true });
  } catch (e) {
    res.json({ e: e.message });
  }
}