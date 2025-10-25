# Goals System Documentation

## Overview

The Goals System allows users to set personal objectives and receive AI-powered advice on time allocation based on their goals. The AI analyzes daily activities against user goals to provide personalized recommendations.

## Features

### 🎯 **Goal Management**
- **Add Goals**: Set title, description, category, priority, and target hours per week
- **Edit Goals**: Update goal details and mark as completed
- **Delete Goals**: Remove goals that are no longer relevant
- **Goal Categories**: Personal, Work, Health, Learning, Hobbies, Family
- **Priority Levels**: Low, Medium, High

### 🤖 **AI Integration**
- **Goal-Aware Summaries**: AI considers user goals when analyzing daily activities
- **Personalized Advice**: Recommendations based on goal priorities and progress
- **Time Allocation Suggestions**: AI suggests activities that align with goals
- **Progress Tracking**: Analysis of time spent toward goal achievement

## How It Works

### 1. **Setting Goals**
Users can add goals with:
- **Title**: Brief goal description (e.g., "Learn Spanish")
- **Description**: Detailed explanation (optional)
- **Category**: Type of goal (Work, Health, Learning, etc.)
- **Priority**: Importance level (Low, Medium, High)
- **Target Hours**: Weekly time commitment (optional)

### 2. **AI Analysis**
When generating daily summaries, the AI:
- Retrieves all user goals from the database
- Analyzes daily activities against goal categories
- Provides specific recommendations based on goal priorities
- Suggests time reallocation to better align with objectives
- Tracks progress toward goal achievement

### 3. **Personalized Recommendations**
The AI provides:
- **Goal Progress Analysis**: How activities align with stated goals
- **Time Allocation Advice**: Suggestions for better goal-focused time use
- **Priority-Based Recommendations**: Activities that match high-priority goals
- **Weekly Target Tracking**: Progress toward target hours per goal

## Example Usage

### Setting a Goal
```
Title: "Learn Spanish"
Description: "Achieve conversational fluency for travel"
Category: "Learning"
Priority: "High"
Target Hours: 5 hours/week
```

### AI Summary Output
```
Based on your goals, I notice you spent 2 hours on Spanish learning today, 
which is great progress toward your weekly target of 5 hours. However, 
you spent 4 hours on social media, which doesn't align with your high-priority 
goal of learning Spanish. Consider reducing social media time and adding 
more Spanish practice to better achieve your language learning objective.
```

## Technical Implementation

### Backend
- **Goal Routes**: RESTful API for goal CRUD operations
- **Database Integration**: Supabase storage for goal persistence
- **AI Service Enhancement**: Goals context passed to AI analysis
- **User Association**: Goals linked to user accounts

### Frontend
- **GoalForm**: Component for adding/editing goals
- **GoalList**: Display and manage existing goals
- **GoalsScreen**: Full goals management interface
- **Navigation**: Seamless integration with main app

### Database Schema
```sql
goals:
- id (primary key)
- user_id (foreign key)
- title (text)
- description (text)
- category (text)
- priority (text)
- target_hours_per_week (number)
- is_completed (boolean)
- created_at (timestamp)
```

## Benefits

### For Users
✅ **Personalized AI Advice**: Recommendations based on actual goals  
✅ **Goal Progress Tracking**: Visual progress toward objectives  
✅ **Time Optimization**: Better allocation based on priorities  
✅ **Motivation**: Clear connection between activities and goals  

### For AI Analysis
✅ **Context-Rich Summaries**: More meaningful insights  
✅ **Goal-Aligned Recommendations**: Specific, actionable advice  
✅ **Priority-Based Suggestions**: Focus on what matters most  
✅ **Progress Awareness**: Understanding of user objectives  

## Future Enhancements

- **Goal Templates**: Pre-defined goal categories with suggestions
- **Progress Visualization**: Charts showing goal achievement over time
- **Goal Reminders**: Notifications for goal-related activities
- **Social Goals**: Sharing and collaboration on goals
- **Goal Analytics**: Detailed insights into goal achievement patterns
