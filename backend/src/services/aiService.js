
import OpenAI from "openai";
import dotenv from "dotenv";
import { findOrCreateUser, updateUser } from "./dbService.js";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getAISummary(user_id, activities, goals = [], period = 'daily') {
  
  const user = await findOrCreateUser(user_id);

  if (user.aiAnalysisCount <= 0) {
    throw new Error('You have no AI analysis credits remaining. Please purchase more.');
  }

  const goalsContext = goals.length > 0 ? `
  
  USER'S GOALS:
  ${goals.map(goal => `
  - ${goal.title}: ${goal.description}
    Category: ${goal.category}
    Priority: ${goal.priority}
    Target: ${goal.target_hours_per_week} hours/week
    Status: ${goal.is_completed ? 'Completed' : 'In Progress'}
  `).join('')}
  ` : '';

  const getPeriodContext = () => {
    switch (period) {
      case 'daily':
        return 'today';
      case 'weekly':
        return 'this week';
      case 'monthly':
        return 'this month';
      case 'yearly':
        return 'this year';
      case 'alltime':
        return 'overall';
      default:
        return 'today';
    }
  };

  const getPeriodInsights = () => {
    switch (period) {
      case 'daily':
        return 'daily patterns, productivity trends, and immediate improvements';
      case 'weekly':
        return 'weekly patterns, goal progress, and weekly optimization opportunities';
      case 'monthly':
        return 'monthly trends, goal achievement, and strategic time allocation';
      case 'yearly':
        return 'annual patterns, major goal progress, and long-term time management strategies';
      case 'alltime':
        return 'overall patterns, lifetime goal progress, and comprehensive time management insights';
      default:
        return 'daily patterns and immediate improvements';
    }
  };

  const prompt = `
  Analyze how I spent my time ${getPeriodContext()} based on the data below:
  ${JSON.stringify(activities)}
  ${goalsContext}
  
  Please provide a comprehensive analysis focusing on:
  1. A summary of how time was spent ${getPeriodContext()}
  2. Analysis of progress toward stated goals ${getPeriodContext()}
  3. Specific recommendations for better time allocation based on the user's goals
  4. Suggestions for activities that align with their priorities
  5. Insights about ${getPeriodInsights()}
  6. Any goal-related insights or adjustments needed
  
  Be specific and actionable in your advice, referencing their actual goals when relevant.
  Consider the time period context (${period}) when providing insights and recommendations.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  await updateUser(user_id, { aiAnalysisCount: user.aiAnalysisCount - 1 });

  return response.choices[0].message.content;
}
