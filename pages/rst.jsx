import { useEffect, useState } from "react";
import { PlayerTable } from "../components/player-table";
import { CountryTable } from "../components/country-table";
import { Container } from "../components/container";

export default function Rst() {
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [lastUpdatedAt, setLastupdatedAt] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [playerResponse, countriesResponse] = await Promise.all([
        fetch('api/players/RST'),
        fetch('api/countries'),
      ])
      
      const { players, lastUpdatedAt } = await playerResponse.json();
      const countries = await countriesResponse.json();
      setPlayers(players);
      setCountries(countries);
      setLastupdatedAt(new Date(lastUpdatedAt.timestamp).toString());
    }

    fetchData(); 
  }, [])
  
  return (
    <div>
      <Container lastUpdatedAt={lastUpdatedAt}>
        <PlayerTable players={players} />
        <CountryTable countries={countries} />
      </Container>
    </div>
  );
}