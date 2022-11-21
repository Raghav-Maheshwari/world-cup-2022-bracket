import { useEffect, useState } from "react";
import { PlayerTable } from "../components/player-table";
import { CountryTable } from "../components/country-table";
import { Container } from "../components/container";

export default function Standings() {
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [playerResponse, countriesResponse] = await Promise.all([
        fetch('api/players/friends'),
        fetch('api/countries'),
      ])
      
      const players = await playerResponse.json();
      const countries = await countriesResponse.json();
      setPlayers(players);
      setCountries(countries);
    }

    fetchData(); 
  }, [])
  
  return (
    <div>
      <Container>
        <PlayerTable players={players} />
        <CountryTable countries={countries} />
      </Container>
    </div>
  );
}