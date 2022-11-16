import { setupDb } from "../lib/setup-db";
import { PlayerTable } from "../components/player-table";

export default function Rst({players}){
  return (
    <PlayerTable players={players} />
  );
}

export async function getServerSideProps(){
  try {
    const db = await setupDb();

    const rstPlayers = await db.collection('players').aggregate(
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
              $eq: "RST"
            }
          }
        }
      ]
    ).toArray();

    return {
      props: {
        players: JSON.parse(JSON.stringify(rstPlayers)),
      }
    }

  } catch (e) {
    return {
      props: {
        error: e.message,
      }
    }
  }
}