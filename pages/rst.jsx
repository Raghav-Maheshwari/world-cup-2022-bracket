import { PlayerTable } from "../components/player-table";
import { useEffect, useState } from "react";

export default function Rst() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('api/players/RST')
      .then(data => data.json())
      .then(data => {
        setPlayers(data.players);
      })
  }, [])
  
  return (
    <div>
      <PlayerTable players={players} />
    </div>
  );
}