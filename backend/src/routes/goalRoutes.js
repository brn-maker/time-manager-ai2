import express from "express";
import { 
  addGoal, 
  getGoals, 
  updateGoal, 
  deleteGoal, 
  getGoalById 
} from "../services/dbService.js";

const router = express.Router();

// Add a new goal
router.post("/", async (req, res) => {
  try {
    const { user_id, title, description, category, priority, target_hours_per_week } = req.body;
    const result = await addGoal(user_id, title, description, category, priority, target_hours_per_week);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all goals for a user
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await getGoals(user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific goal
router.get("/:user_id/:goal_id", async (req, res) => {
  try {
    const { user_id, goal_id } = req.params;
    const result = await getGoalById(user_id, goal_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a goal
router.put("/:goal_id", async (req, res) => {
  try {
    const { goal_id } = req.params;
    const { title, description, category, priority, target_hours_per_week, is_completed } = req.body;
    const result = await updateGoal(goal_id, { title, description, category, priority, target_hours_per_week, is_completed });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a goal
router.delete("/:goal_id", async (req, res) => {
  try {
    const { goal_id } = req.params;
    const result = await deleteGoal(goal_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
