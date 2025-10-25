# Fix Database Schema Issue

## Problem
The Supabase database is missing the new columns needed for cross-day activities and goals functionality.

## Error Messages
- `column activities.start_date does not exist`
- `Could not find the 'is_cross_day' column of 'activities' in the schema cache`

## Solution

### Step 1: Update Database Schema

1. **Go to your Supabase Dashboard**
   - Open your project in Supabase
   - Navigate to the SQL Editor

2. **Run the Migration Script**
   - Copy and paste the contents of `DATABASE_MIGRATION.sql`
   - Click "Run" to execute the migration

3. **Verify the Migration**
   - Check that the new columns were added
   - The script will show the table structure at the end

### Step 2: Test the Fix

1. **Restart your backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Test adding an activity**
   - Try adding a simple duration-based activity
   - Check console logs for success messages

3. **Test cross-day functionality**
   - Toggle "Use time range" switch
   - Add a cross-day activity (e.g., sleep from 8pm to 4am)
   - Verify it appears in the breakdown

### Step 3: Verify Database Changes

After running the migration, your `activities` table should have these columns:
- `id` (primary key)
- `user_id` (text)
- `activity` (text)
- `duration` (numeric)
- `created_at` (timestamp)
- `start_date` (text, nullable) ← NEW
- `start_time` (text, nullable) ← NEW
- `end_date` (text, nullable) ← NEW
- `end_time` (text, nullable) ← NEW
- `is_cross_day` (boolean, nullable) ← NEW

And a new `goals` table should be created with:
- `id` (primary key)
- `user_id` (text)
- `title` (text)
- `description` (text)
- `category` (text)
- `priority` (text)
- `target_hours_per_week` (numeric)
- `is_completed` (boolean)
- `created_at` (timestamp)

## Expected Results

After the migration:
✅ Activities should save successfully  
✅ Activities should appear in the breakdown  
✅ Cross-day activities should work  
✅ Goals functionality should work  
✅ No more database column errors  

## Troubleshooting

### If Migration Fails
- Check that you have the correct permissions in Supabase
- Ensure you're running the script in the SQL Editor, not the Table Editor
- Try running the commands one by one instead of all at once

### If Activities Still Don't Show
- Check the console logs for any remaining errors
- Verify the `created_at` timestamp is being set correctly
- Try refreshing the app after adding an activity

### If Cross-Day Activities Don't Work
- Ensure the new columns were added successfully
- Check that the time range data is being saved
- Verify the date filtering logic is working

## Next Steps

Once the database schema is updated:
1. Test basic activity creation
2. Test cross-day activities
3. Test goals functionality
4. Verify all features work as expected

The app should now work perfectly with both legacy duration-based activities and new cross-day time range activities!
