import express from "express";
import { addActivity, getActivities, getActivitiesByDate, getActivitiesForCalendar, summarizeDay, getGoals, getActivitiesByPeriod, updateActivity, deleteActivity } from "../services/dbService.js";
import { getAISummary } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { 
      user_id, 
      activity, 
      duration, 
      date,
      start_date,
      start_time,
      end_date,
      end_time,
      is_cross_day
    } = req.body;
    
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
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await getActivities(user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activities for a specific date
router.get("/:user_id/:date", async (req, res) => {
  try {
    const { user_id, date } = req.params;
    const result = await getActivitiesByDate(user_id, date);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calendar route removed - using regular activities route instead

// Update activity
router.put("/:activity_id", async (req, res) => {
  try {
    const { activity_id } = req.params;
    const { 
      user_id, 
      activity, 
      duration, 
      date,
      start_date,
      start_time,
      end_date,
      end_time,
      is_cross_day
    } = req.body;
    
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
    const { user_id } = req.body;
    
    const result = await deleteActivity(activity_id, user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/summary/ai", async (req, res) => {
  try {
    const { user_id, period = 'daily', date } = req.body;
    
    console.log(`AI Summary request: user_id=${user_id}, period=${period}, date=${date}`);
    
    // Get user's goals for context
    const goals = user_id ? await getGoals(user_id) : [];
    console.log(`Found ${goals?.length || 0} goals for user`);
    
    // Get activities for the specified period
    const activities = await getActivitiesByPeriod(user_id, period, date);
    console.log(`Retrieved ${activities?.length || 0} activities for AI summary`);
    
    if (!activities || activities.length === 0) {
      const periodLabels = {
        'daily': 'today',
        'weekly': 'this week',
        'monthly': 'this month',
        'yearly': 'this year',
        'alltime': 'overall'
      };
      
      console.log(`No activities found for ${periodLabels[period] || 'this period'}`);
      return res.json({ 
        summary: `No activities found for ${periodLabels[period] || 'this period'}. Add some activities to get personalized insights!` 
      });
    }
    
    console.log(`Activities data being sent to AI:`, JSON.stringify(activities, null, 2));
    const aiResponse = await getAISummary(activities, goals, period);
    res.json({ summary: aiResponse });
  } catch (error) {
    console.error("AI Summary error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
