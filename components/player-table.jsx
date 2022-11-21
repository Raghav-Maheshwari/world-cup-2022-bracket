import styles from './player-table.module.css';
import { useEffect, useState } from 'react';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@kiwicom/orbit-components/lib/Table";
import Heading from '@kiwicom/orbit-components/lib/Heading';

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
    const { name, flag_url } = country;
    
    
    return (
      <div className={styles.countryContainer}>
        {!isMobile && 
          <span className={styles.countryName}>{name}</span>
        }
        <img className={styles.countryFlag} src={flag_url} /> 
      </div>
    );
  }
  
  const playerList = players.map(player => {
    const aggregateScore = player.picks.reduce((acc, country) => {
      return acc + country.score;
    }, 0);

    const countryPicks = player.picks.map(country => {
      return <CountryPick key={country.name} country={country} />
    });

    return (
      <TableRow key={player._id}>
        <TableCell>{player.name}</TableCell>
        <TableCell>{aggregateScore}</TableCell>
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

