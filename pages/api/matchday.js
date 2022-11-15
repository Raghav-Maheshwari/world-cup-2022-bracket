import clientPromise from "../../lib/mongodb";

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
 * to get the matches of the current day and compute scores for winning countries
 */
export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("world-cup-2022-bracket-db");
    // const worldcupApiResponse = await fetch('https://world-cup-json-2022.fly.dev/matches/today');
    // const matchesToday = await worldcupApiResponse.json();

    const matches = [
      {
        "id": 2,
        "venue": "Al Bayt Stadium",
        "location": "Al Khor",
        "status": "future_scheduled",
        "weather": {
          "humidity": null,
          "temp_celsius": null,
          "temp_farenheit": null,
          "wind_speed": null,
          "description": null
        },
        "attendance": null,
        "officials": [],
        "stage_name": "First stage",
        "home_team_country": "QAT",
        "away_team_country": "ECU",
        "datetime": "2022-11-20T16:00:00Z",
        "winner": 'ECU',
        "winner_code": '4943',
        "home_team": {
          "country": "QAT",
          "name": "Qatar",
          "goals": null,
          "penalties": null
        },
        "away_team": {
          "country": "ECU",
          "name": "Ecuador",
          "goals": null,
          "penalties": null
        },
        "last_checked_at": "2022-10-27T17:53:29Z",
        "last_changed_at": "2022-10-27T17:53:29Z"
      }
    ]

    await handleMatches(matches, db);


    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message })
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
    
    if (match.winner === homeTeam.country_code) {
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




