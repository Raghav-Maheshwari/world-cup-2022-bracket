import clientPromise from "../mongodb";

export const updateCronJobCount = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("world-cup-2022-bracket-db");

    const { count } = await db.collection('cron-job-count')
      .findOne();

    if (isNaN(count)) {
      throw new Error('unable to find current cron job count');
    }
    
    const updatedCronJobCount = count + 1;
   
    await db.collection('cron-job-count').updateOne({
      title: 'cron-job-count'
    }, {
      $set: { count: updatedCronJobCount }
    });

    return updatedCronJobCount;

  } catch (e) {
    throw e;
  }
}