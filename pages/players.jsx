import clientPromise from "../lib/mongodb";


export default function Players({ players }) {
  const playerList = players.map(player => <p key={player._id}>{player.name}</p>);

  return (
    <div>
      {playerList}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("world-cup-2022-bracket-db");

    const players = await db
      .collection('players')
      .find()
      .toArray();

      return {
        props: { players: JSON.parse(JSON.stringify(players))},
      };
  } catch (e) {
      console.error(e);
  }
}