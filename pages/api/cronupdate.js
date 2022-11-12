import { updateCronJobCount } from "../../lib/utils/update-cronjob-count";

export default async (req, res) => {
  try {
    const cronJobCount = await updateCronJobCount();

    res.status(200).json({ success: true, cronJobCount });
  } catch (e) {
    res.json({ error: e.message });
  }
}