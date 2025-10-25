# Debugging Activity Issues

## Issues Fixed

### 1. **Database Date Handling**
- **Problem**: Activities weren't being saved with the correct date
- **Fix**: Added proper `created_at` timestamp handling in `addActivity` function
- **Result**: Activities now save with the correct date for proper filtering

### 2. **Database Query Issues**
- **Problem**: Complex OR query in `getActivitiesByDate` was failing
- **Fix**: Split into separate queries for legacy and time-range activities
- **Result**: More reliable activity fetching

### 3. **Error Handling**
- **Problem**: No feedback when activities fail to save
- **Fix**: Added comprehensive error handling and logging
- **Result**: Better debugging and user feedback

## Debugging Steps

### 1. **Check Console Logs**
Open your browser/device console and look for:
```
Sending activity data: {user_id: "123", activity: "Sleep", ...}
Activity added successfully: {message: "Activity added", data: [...]}
Fetching activities for date: 2024-01-16
Fetched activities: [...]
```

### 2. **Test Activity Creation**
1. Open the app
2. Try adding a simple activity (duration-based):
   - Activity: "Test Activity"
   - Hours: 1
   - Click "Add Activity"
3. Check console for success/error messages

### 3. **Test Time Range Activity**
1. Toggle "Use time range" switch
2. Set:
   - Start Date: Today's date
   - Start Time: 20:00
   - End Date: Tomorrow's date  
   - End Time: 04:00
3. Click "Add Activity"

### 4. **Check Supabase Database**
1. Go to your Supabase dashboard
2. Navigate to the `activities` table
3. Check if new records are being created
4. Verify the `created_at` timestamp matches your selected date

## Common Issues & Solutions

### Issue: "No activities recorded for this date"
**Causes:**
- Activities saved with wrong date
- Database query not finding activities
- Network/API connection issues

**Solutions:**
- Check console logs for errors
- Verify Supabase connection
- Check if activities exist in database
- Try refreshing the app

### Issue: Activities not showing in breakdown
**Causes:**
- Activities saved but not fetched properly
- Date filtering issues
- Chart data processing errors

**Solutions:**
- Check if activities appear in the list
- Verify date selection
- Check console for fetch errors

### Issue: Cross-day activities not working
**Causes:**
- Time range calculation errors
- Date handling issues
- Database query problems

**Solutions:**
- Check start/end date format
- Verify duration calculation
- Check console for time range errors

## Database Schema Requirements

Make sure your Supabase `activities` table has these columns:
```sql
- id (primary key)
- user_id (text)
- activity (text)
- duration (numeric)
- created_at (timestamp)
- start_date (text, nullable)
- start_time (text, nullable)
- end_date (text, nullable)
- end_time (text, nullable)
- is_cross_day (boolean, nullable)
```

## API Endpoints

- **POST** `/api/activities` - Add new activity
- **GET** `/api/activities/123/2024-01-16` - Get activities for specific date
- **GET** `/api/activities/123` - Get all activities for user

## Next Steps

1. **Test the fixes** by adding a simple activity
2. **Check console logs** for any remaining errors
3. **Verify database** entries in Supabase
4. **Report any issues** with specific error messages
