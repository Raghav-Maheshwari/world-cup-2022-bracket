import styles from './player-table.module.css';
import { useEffect, useState } from 'react';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@kiwicom/orbit-components/lib/Table";
import Heading from '@kiwicom/orbit-components/lib/Heading';
import Tooltip from "@kiwicom/orbit-components/lib/Tooltip";

export const PlayerTable = ({ players }) => {
  
  const [width, setWidth] = useState();
  
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 500;

  const CountryPick = ({ country }) => {
    const { name, flag_url, score } = country;
    
    const tooltipContent = `points: ${score.toFixed(2)}`;
    
    return (
      <Tooltip content={tooltipContent} placement="bottom">
        <div className={`${styles.countryContainer} ${country.eliminated ? styles.eliminatedCountryContainer : ""}`}>
          {!isMobile && 
            <span className={`${styles.countryName} ${country.eliminated ? styles.eliminatedCountry : ""}`}>{name}</span>
          }
          <img className={styles.countryFlag} src={flag_url} /> 
        </div>
      </Tooltip>
    );
  }
  
  const playerList = players.sort((playerA, playerB) => {
    const playerAScore = playerA.picks.reduce((acc, country) => {
      return acc + country.score;
    }, 0);

    const playerBScore = playerB.picks.reduce((acc, country) => {
      return acc + country.score;
    }, 0);

    return playerBScore - playerAScore;
  }).map(player => {
    const aggregateScore = player.picks.reduce((acc, country) => {
      return acc + country.score;
    }, 0);

    const countryPicks = player.picks.map(country => {
      return <CountryPick key={country.name} country={country} />
    });

    return (
      <TableRow key={player._id}>
        <TableCell>{player.name}</TableCell>
        <TableCell>{aggregateScore.toFixed(2)}</TableCell>
        <TableCell>
          <div className={styles.countryRow}>
            {countryPicks}
          </div>
        </TableCell>
      </TableRow>
    );
  })

  

  return (
    <div className={styles.tableContainer}>
      <Heading type="title2">Players</Heading>
      <Table compact={true}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Picks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playerList}
        </TableBody>
      </Table>
    </div>
  );
}

