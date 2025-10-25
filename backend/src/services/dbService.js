import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Create optimized Supabase client with connection pooling
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false, // Disable session persistence for better performance
  },
  global: {
    headers: {
      'X-Client-Info': 'time-manager-ai-backend',
    },
  },
});

export async function addActivity(
  user_id, 
  activity, 
  duration, 
  date = null,
  start_date = null,
  start_time = null,
  end_date = null,
  end_time = null,
  is_cross_day = false
) {
  const activityData = { 
    user_id, 
    activity, 
    duration
  };
  
  // Handle date properly - use provided date or current timestamp
  if (date) {
    // For legacy activities with a specific date, create a timestamp for that date
    activityData.created_at = new Date(date + 'T12:00:00.000Z').toISOString();
  } else {
    // For time range activities, use current timestamp
    activityData.created_at = new Date().toISOString();
  }
  
  // Add time range data if provided (after running the migration)
  if (start_date && start_time) {
    activityData.start_date = start_date;
    activityData.start_time = start_time;
  }
  
  if (end_date && end_time) {
    activityData.end_date = end_date;
    activityData.end_time = end_time;
  }
  
  if (is_cross_day !== undefined) {
    activityData.is_cross_day = is_cross_day;
  }
  
  console.log("Activity data to insert:", activityData);
  
  const { data, error } = await supabase.from("activities").insert([activityData]).select();
  
  console.log("Supabase response:", { data, error });
  
  if (error) {
    console.error("Database error:", error);
    return { error };
  }
  
  if (!data || data.length === 0) {
    console.log("No data returned from insert, trying to fetch the activity");
    
    // Fallback: fetch the activity we just inserted
    const { data: fetchedData, error: fetchError } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user_id)
      .eq("activity", activity)
      .eq("duration", duration)
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error("Error fetching inserted activity:", fetchError);
      return { error: "Failed to fetch inserted activity" };
    }
    
    if (!fetchedData || fetchedData.length === 0) {
      console.error("Could not find inserted activity");
      return { error: "Activity inserted but could not be retrieved" };
    }
    
    console.log("Successfully fetched inserted activity:", fetchedData[0]);
    return { message: "Activity added", data: fetchedData[0] };
  }
  
  console.log("Successfully inserted activity:", data[0]);
  return { message: "Activity added", data: data[0] };
}

export async function getActivities(user_id) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  
  if (error) return { error };
  return data;
}

export async function getActivitiesByDate(user_id, date) {
  console.log(`Fetching activities for user ${user_id} on date ${date}`);
  
  const startDate = `${date}T00:00:00.000Z`;
  const endDate = `${date}T23:59:59.999Z`;
  
  try {
    // Optimized single query with OR conditions
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user_id)
      .or(`and(created_at.gte.${startDate},created_at.lte.${endDate}),start_date.eq.${date},end_date.eq.${date}`);
    
    if (error) {
      console.error("Error fetching activities:", error);
      return { error };
    }
    
    console.log(`Found ${data?.length || 0} activities for date ${date}`);
    return data || [];
    
  } catch (error) {
    console.error("Error fetching activities:", error);
    return { error };
  }
}

export async function getActivitiesForCalendar(user_id) {
  // Get all activities for calendar marking (we'll filter by date in the frontend)
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: true });
  
  if (error) return { error };
  return data || [];
}

export async function summarizeDay(user_id, date = null) {
  let query = supabase
    .from("activities")
    .select("duration")
    .eq("user_id", user_id);
  
  if (date) {
    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;
    query = query.gte("created_at", startDate).lte("created_at", endDate);
  }
  
  const { data, error } = await query;
  if (error) return { error };
  return data.reduce((acc, cur) => acc + cur.duration, 0);
}

// Goals management functions
export async function addGoal(user_id, title, description, category, priority, target_hours_per_week) {
  const goalData = {
    user_id,
    title,
    description,
    category,
    priority,
    target_hours_per_week,
    is_completed: false,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase.from("goals").insert([goalData]);
  if (error) return { error };
  return { message: "Goal added", data };
}

export async function getGoals(user_id) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  
  if (error) return { error };
  return data || [];
}

export async function getGoalById(user_id, goal_id) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user_id)
    .eq("id", goal_id)
    .single();
  
  if (error) return { error };
  return data;
}

export async function updateGoal(goal_id, updates) {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", goal_id);
  
  if (error) return { error };
  return { message: "Goal updated", data };
}

export async function deleteGoal(goal_id) {
  const { data, error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goal_id);
  
  if (error) return { error };
  return { message: "Goal deleted", data };
}

// New functions for different time periods
export async function updateActivity(
  activity_id,
  user_id,
  activity,
  duration,
  date = null,
  start_date = null,
  start_time = null,
  end_date = null,
  end_time = null,
  is_cross_day = false
) {
  const updateData = { 
    activity, 
    duration
  };
  
  // Handle date properly - use provided date or current timestamp
  if (date) {
    // For legacy activities with a specific date, create a timestamp for that date
    updateData.created_at = new Date(date + 'T12:00:00.000Z').toISOString();
  }
  
  // Add time range data if provided
  if (start_date && start_time) {
    updateData.start_date = start_date;
    updateData.start_time = start_time;
  }
  
  if (end_date && end_time) {
    updateData.end_date = end_date;
    updateData.end_time = end_time;
  }
  
  if (is_cross_day !== undefined) {
    updateData.is_cross_day = is_cross_day;
  }
  
  console.log("Activity update data:", updateData);
  
  const { data, error } = await supabase
    .from("activities")
    .update(updateData)
    .eq("id", activity_id)
    .eq("user_id", user_id)
    .select();
  
  console.log("Supabase update response:", { data, error });
  
  if (error) {
    console.error("Database error:", error);
    return { error };
  }
  
  if (!data || data.length === 0) {
    console.error("No data returned from update");
    return { error: "Activity not found or update failed" };
  }
  
  console.log("Successfully updated activity:", data[0]);
  return { message: "Activity updated", data: data[0] };
}

export async function deleteActivity(activity_id, user_id) {
  const { data, error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activity_id)
    .eq("user_id", user_id)
    .select();
  
  if (error) {
    console.error("Database error:", error);
    return { error };
  }
  
  if (!data || data.length === 0) {
    console.error("No data returned from delete");
    return { error: "Activity not found or delete failed" };
  }
  
  console.log("Successfully deleted activity:", data[0]);
  return { message: "Activity deleted", data: data[0] };
}

export async function getActivitiesByPeriod(user_id, period, date) {
  console.log(`Fetching activities for user ${user_id}, period: ${period}, date: ${date}`);
  
  const targetDate = new Date(date);
  
  let startDate, endDate;
  
  switch (period) {
    case 'daily':
      startDate = new Date(targetDate);
      endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);
      break;
      
    case 'weekly':
      // Get start of week (Monday)
      const dayOfWeek = targetDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - daysToMonday);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      break;
      
    case 'monthly':
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
      break;
      
    case 'yearly':
      startDate = new Date(targetDate.getFullYear(), 0, 1);
      endDate = new Date(targetDate.getFullYear() + 1, 0, 1);
      break;
      
    case 'alltime':
      // No date filtering for all time
      startDate = null;
      endDate = null;
      break;
      
    default:
      startDate = new Date(targetDate);
      endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);
  }
  
  console.log(`Date range: ${startDate ? startDate.toISOString() : 'null'} to ${endDate ? endDate.toISOString() : 'null'}`);
  
  let query = supabase
    .from("activities")
    .select("*")
    .eq("user_id", user_id);
  
  if (startDate && endDate) {
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    const startDateOnly = startDate.toISOString().split('T')[0];
    const endDateOnly = endDate.toISOString().split('T')[0];
    
    console.log(`Querying with date range: ${startDateStr} to ${endDateStr}`);
    console.log(`Date-only range: ${startDateOnly} to ${endDateOnly}`);
    
    // Simplified query - try legacy activities first, then time-range activities
    // First try the legacy created_at approach
    const { data: legacyData, error: legacyError } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user_id)
      .gte("created_at", startDateStr)
      .lt("created_at", endDateStr)
      .order("created_at", { ascending: false });
    
    if (legacyError) {
      console.error("Error fetching legacy activities:", legacyError);
    } else {
      console.log(`Found ${legacyData?.length || 0} legacy activities`);
    }
    
    // Then try time-range activities
    const { data: timeRangeData, error: timeRangeError } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user_id)
      .or(`and(start_date.gte.${startDateOnly},start_date.lt.${endDateOnly}),and(end_date.gte.${startDateOnly},end_date.lt.${endDateOnly})`)
      .order("created_at", { ascending: false });
    
    if (timeRangeError) {
      console.error("Error fetching time-range activities:", timeRangeError);
    } else {
      console.log(`Found ${timeRangeData?.length || 0} time-range activities`);
    }
    
    // Combine results and remove duplicates
    const allActivities = [...(legacyData || []), ...(timeRangeData || [])];
    const uniqueActivities = allActivities.filter((activity, index, self) => 
      index === self.findIndex(a => a.id === activity.id)
    );
    
    console.log(`Total unique activities found: ${uniqueActivities.length}`);
    return uniqueActivities;
  } else {
    // For alltime or when no date filtering
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching activities by period:", error);
      return { error };
    }
    
    console.log(`Found ${data?.length || 0} activities for all time`);
    return data || [];
  }
}
