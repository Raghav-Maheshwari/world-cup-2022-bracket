import styles from './player-table.module.css';

export const PlayerTable = ({ players }) => {
  const playerList = players.map(player => {
    const aggregateScore = player.picks.reduce((acc, country) => {
      return acc + country.score;
    }, 0);

    return (
      <div key={player._id} className={styles.playerRow}>
        <div>{player.name}</div>
        <div>{aggregateScore}</div>
      </div>
    );
  })


  return (
    <div className={styles.tableContainer}>
      {playerList}
    </div>
  );
} 