import { setupDb } from "../../lib/setup-db";

const STAGE_TO_POINTS = {
  "First stage": 3,
  "Round of 16": 6,
  "Quarter-final": 9,
  "Semi-final": 12,
  "Play-off for third place": 3,
  "Final": 15
}

/**
 * api/matchday endpoint that a CRON job will hit every 5 minutes
 * to get the matches of world cup and compute scores for winning countries
 */
export default async (req, res) => {
  try {
    const db = await setupDb();
    const worldcupApiResponse = await fetch('https://world-cup-json-2022.fly.dev/matches');
    const matches = await worldcupApiResponse.json();

    await handleMatches(matches, db);
    await updateTimestamp(db);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const updateTimestamp = async (db) => {
  try {
    const currentTime = Date.now();

    await db.collection('last-updated')
      .updateOne({
        title: 'last-updated-at',
      }, {
        $set: { timestamp: currentTime }
      });

    return currentTime;
  } catch (e) {
    throw e;
  }
}


const handleMatches = async (matches, db) => {
  try {
    // filter on completed matches
    const completedMatches = matches.filter(match => match.status === 'completed');

    for (const match of completedMatches) {
      // if match_id exists in db.matches, then we haven't scored the match yet
      if (await isUnscoredMatch(match, db)) {
        await scoreCompletedMatch(match, db);

        // once match is scored, then remove it from the DB
        await removeScoredMatchFromDb(match, db);
      }
    }

    return;
  } catch (e) {
    throw e;
  }
}

const scoreCompletedMatch = async (match, db) => {
  const homeTeam = await db.collection('countries').findOne(
    { country_code: match.home_team_country }
  );

  const awayTeam = await db.collection('countries').findOne(
    { country_code: match.away_team_country }
  );
  
  
  if (match.winner === 'Draw') {
    if (homeTeam.cost > awayTeam.cost) {
      // away team was the underdog
      await db.collection('countries').updateOne(
        { country_code: awayTeam.country_code },
        {
          $inc: {
            score: (Math.round((1*(homeTeam.cost / awayTeam.cost)) * 100) / 100),
          }
        }
      )

      await db.collection('countries').updateOne(
        { country_code: homeTeam.country_code },
        {
          $inc: {
            score: 1,
          }
        }
      )
    } else {
      // home team was the underdog
      await db.collection('countries').updateOne(
        { country_code: homeTeam.country_code },
        {
          $inc: {
            score: (Math.round((1*(awayTeam.cost / homeTeam.cost)) * 100) / 100),
          }
        }
      )

      await db.collection('countries').updateOne(
        { country_code: awayTeam.country_code },
        {
          $inc: {
            score: 1,
          }
        }
      )
    }
  } else {
    const pointsForMatch = STAGE_TO_POINTS[match.stage_name];

    let winnerTeam;
    let loserTeam;
    let pointsToWinner;

    winnerTeam = match.winner;
    
    if (match.winner_code === homeTeam.country_code) {
      winnerTeam = homeTeam;
      loserTeam = awayTeam;
    } else {
      winnerTeam = awayTeam;
      loserTeam = homeTeam;
    }

    if (winnerTeam.cost < loserTeam.cost) {
      // an upset occurred:
      pointsToWinner = (Math.round((pointsForMatch*(loserTeam.cost / winnerTeam.cost)) * 100) / 100)
    } else {
      pointsToWinner = pointsForMatch;
    }

    await db.collection('countries').updateOne(
      { country_code: winnerTeam.country_code },
      {
        $inc: {
          score: pointsToWinner,
        }
      }
    );
  }
}

const removeScoredMatchFromDb = async (match, db) => {
  return await db.collection('matches').remove({ match_id: match.id });
}

const isUnscoredMatch = async (match, db) => {
  const foundMatchInDb = await  db.collection('matches').findOne({ match_id: match.id });
  return !!foundMatchInDb;
}




