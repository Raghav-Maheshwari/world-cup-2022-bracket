import { updateCronJobCount } from "../../lib/utils/update-cronjob-count";
import { verifySignature } from '@upstash/qstash/nextjs';

const cronJobHandler = async (req, res) => {
  try {
    const cronJobCount = await updateCronJobCount();

    res.status(200).json({ success: true, cronJobCount });
  } catch (e) {
    res.json({ error: e.message });
  }
}

export default verifySignature(cronJobHandler);

/**
 * To verify the authenticity of the incoming request in the `verifySignature`
 * function, we need access to the raw request body.
 */
 export const config = {
  api: {
    bodyParser: false,
  },
};