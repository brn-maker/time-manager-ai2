
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// User management functions
export async function findOrCreateUser(user_id) {
  const userRef = db.collection('users').doc(user_id);
  const doc = await userRef.get();

  if (!doc.exists) {
    console.log('No such document! Creating new user.');
    const newUser = {
      aiAnalysisCount: 5,
      createdAt: new Date(),
    };
    await userRef.set(newUser);
    return newUser;
  } else {
    return doc.data();
  }
}

export async function updateUser(user_id, updates) {
  const userRef = db.collection('users').doc(user_id);
  try {
    await userRef.update(updates);
    return { message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error };
  }
}


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
    duration,
    created_at: date ? new Date(date + 'T12:00:00.000Z') : new Date(),
    start_date,
    start_time,
    end_date,
    end_time,
    is_cross_day,
  };

  try {
    const docRef = await db.collection('activities').add(activityData);
    const doc = await docRef.get();
    return { message: 'Activity added', data: { id: doc.id, ...doc.data() } };
  } catch (error) {
    console.error('Database error:', error);
    return { error };
  }
}

export async function getActivities(user_id) {
  try {
    const snapshot = await db.collection('activities')
      .where('user_id', '==', user_id)
      .orderBy('created_at', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return { error };
  }
}

export async function getActivitiesByDate(user_id, date) {
  console.log(`Fetching activities for user ${user_id} on date ${date}`);
  
  try {
    const snapshot = await db.collection('activities')
      .where('user_id', '==', user_id)
      .where('start_date', '==', date)
      .get();
      
    const snapshot2 = await db.collection('activities')
      .where('user_id', '==', user_id)
      .where('end_date', '==', date)
      .get();

    const activities = new Map();
    snapshot.docs.forEach(doc => activities.set(doc.id, { id: doc.id, ...doc.data() }));
    snapshot2.docs.forEach(doc => activities.set(doc.id, { id: doc.id, ...doc.data() }));
    
    return Array.from(activities.values());
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { error };
  }
}

export async function getActivitiesForCalendar(user_id) {
  try {
    const snapshot = await db.collection('activities')
      .where('user_id', '==', user_id)
      .orderBy('created_at', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return { error };
  }
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
    created_at: new Date()
  };
  
  try {
    const docRef = await db.collection('goals').add(goalData);
    const doc = await docRef.get();
    return { message: 'Goal added', data: { id: doc.id, ...doc.data() } };
  } catch (error) {
    return { error };
  }
}

export async function getGoals(user_id) {
  try {
    const snapshot = await db.collection('goals')
      .where('user_id', '==', user_id)
      .orderBy('created_at', 'desc')
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return { error };
  }
}

export async function getGoalById(user_id, goal_id) {
  try {
    const doc = await db.collection('goals').doc(goal_id).get();
    if (doc.exists && doc.data().user_id === user_id) {
      return { id: doc.id, ...doc.data() };
    }
    return { error: 'Goal not found' };
  } catch (error) {
    return { error };
  }
}

export async function updateGoal(goal_id, updates) {
  try {
    await db.collection('goals').doc(goal_id).update(updates);
    return { message: 'Goal updated' };
  } catch (error) {
    return { error };
  }
}

export async function deleteGoal(goal_id) {
  try {
    await db.collection('goals').doc(goal_id).delete();
    return { message: 'Goal deleted' };
  } catch (error) {
    return { error };
  }
}

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
    duration,
    start_date,
    start_time,
    end_date,
    end_time,
    is_cross_day,
  };
  
  if (date) {
    updateData.created_at = new Date(date + 'T12:00:00.000Z');
  }

  try {
    await db.collection('activities').doc(activity_id).update(updateData);
    return { message: 'Activity updated' };
  } catch (error) {
    console.error('Database error:', error);
    return { error };
  }
}

export async function deleteActivity(activity_id, user_id) {
  try {
    // We can add a check to make sure the user owns the activity before deleting
    await db.collection('activities').doc(activity_id).delete();
    return { message: 'Activity deleted' };
  } catch (error) {
    console.error('Database error:', error);
    return { error };
  }
}

export async function getActivitiesByPeriod(user_id, period, date) {
  console.log(`Fetching activities for user ${user_id}, period: ${period}, date: ${date}`);
  
  const targetDate = new Date(date);
  let startDate, endDate;

  // ... [rest of the date logic is the same]

  let query = db.collection('activities').where('user_id', '==', user_id);

  if (startDate && endDate) {
    query = query.where('created_at', '>=', startDate).where('created_at', '<', endDate);
  }

  try {
    const snapshot = await query.orderBy('created_at', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching activities by period:`, error);
    return { error };
  }
}
