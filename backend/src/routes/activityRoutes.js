import express from "express";
import { addActivity, getActivities, getActivitiesByDate, getActivitiesByPeriod, updateActivity, deleteActivity, getGoals } from "../services/dbService.js";
import { getAISummary } from "../services/aiService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes in this file
router.use(protect);

router.post("/", async (req, res) => {
  try {
    const {
      activity,
      duration,
      date,
      start_date,
      start_time,
      end_date,
      end_time,
      is_cross_day
    } = req.body;
    const user_id = req.user.uid; // Get user_id from authenticated user

    const result = await addActivity(
      user_id,
      activity,
      duration,
      date,
      start_date,
      start_time,
      end_date,
      end_time,
      is_cross_day
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all activities for a user
router.get("/", async (req, res) => {
  try {
    const user_id = req.user.uid; // Get user_id from authenticated user
    const result = await getActivities(user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activities for a specific date
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const user_id = req.user.uid; // Get user_id from authenticated user
    const result = await getActivitiesByDate(user_id, date);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update activity
router.put("/:activity_id", async (req, res) => {
  try {
    const { activity_id } = req.params;
    const {
      activity,
      duration,
      date,
      start_date,
      start_time,
      end_date,
      end_time,
      is_cross_day
    } = req.body;
    const user_id = req.user.uid; // Get user_id from authenticated user

    const result = await updateActivity(
      activity_id,
      user_id,
      activity,
      duration,
      date,
      start_date,
      start_time,
      end_date,
      end_time,
      is_cross_day
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete activity
router.delete("/:activity_id", async (req, res) => {
  try {
    const { activity_id } = req.params;
    const user_id = req.user.uid; // Get user_id from authenticated user

    const result = await deleteActivity(activity_id, user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/summary/ai", async (req, res) => {
  try {
    const { period = 'daily', date } = req.body;
    const user_id = req.user.uid;

    // Get user's goals for context
    const goals = await getGoals(user_id);

    // Get activities for the specified period
    const activities = await getActivitiesByPeriod(user_id, period, date);

    if (!activities || activities.length === 0) {
      const periodLabels = {
        'daily': 'today',
        'weekly': 'this week',
        'monthly': 'this month',
        'yearly': 'this year',
        'alltime': 'overall'
      };

      return res.json({
        summary: `No activities found for ${periodLabels[period] || 'this period'}. Add some activities to get personalized insights!`
      });
    }

    const aiResponse = await getAISummary(user_id, activities, goals, period);
    res.json({ summary: aiResponse });
  } catch (error) {
    console.error("AI Summary error:", error);
    res.status(403).json({ error: error.message }); // Use 403 for permission denied
  }
});

export default router;
