'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };
import userStore from "../models/user-store.js";


const activity = {
  createView(request, response) {
    const activityId = parseInt(request.params.id);
    logger.info(`Activity details page loading for ID: ${activityId}`);
    
  
    const foundActivity = appData.activities.find(activity => activity.id === activityId);

    const viewData = {
      title: `${foundActivity.name} - Activity Details`,
      id: "activity",
      activity: foundActivity,
      user: request.session.user
    };

    response.render("activity", viewData);
  },

  listUserActivities(request, response) {
    const userId = request.session.user.id;
    logger.info(`Loading activities for user ID: ${userId}`);
    
    // NEW CODE: Get search and sort parameters from query string
    const searchQuery = request.query.search || '';
    const sortBy = request.query.sort || 'name';
    
    // NEW CODE: Debug logging to check if parameters are received
    logger.info(`Search query: "${searchQuery}", Sort by: "${sortBy}"`);
    
    const user = userStore.findUserById(userId);
    let activities = user.activities || [];
    
    // NEW CODE: Filter user activities based on search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      activities = activities.filter(activity => 
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.difficulty.toLowerCase().includes(searchLower)
      );
      logger.info(`Filtered activities from ${user.activities.length} to ${activities.length}`);
    }
    
    // NEW CODE: Sort user activities based on sort parameter
    if (sortBy === 'name') {
      activities.sort((a, b) => a.name.localeCompare(b.name));
      logger.info(`Sorted by name`);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      activities.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      logger.info(`Sorted by difficulty`);
    }
    
    // Calculate individual user statistics
    const userStats = userStore.getUserStats(userId);

    const viewData = {
      title: "My Activities",
      id: "my-activities",
      activities: activities,
      user: request.session.user,
      searchQuery: searchQuery,
      sortBy: sortBy,
      userStats: userStats
    };
    
    response.render("my-activities", viewData);
  },

  // NEW CODE: Display form for adding a new activity
  createActivityView(request, response) {
    logger.info("Displaying add activity form");
    
    const viewData = {
      title: "Add Activity",
      id: "add-activity",
      activity: null,
      error: request.query.error || null,
      user: request.session.user
    };
    
    response.render("activity-form", viewData);
  },

  // create new activity for the user
  createActivity(request, response) {
    logger.info("Processing new activity creation");
    
    const userId = request.session.user.id;
    const { name, description, difficulty, image, details } = request.body;
    
    if (!name || !description || !difficulty) {
      return response.redirect(`/activity/add?error=${encodeURIComponent('Name, description and difficulty are required')}`);
    }
    
    // FUNCTION
    const newActivity = {
      name,
      description,
      difficulty,
      image: image || "/default-activity.jpg",
      details: details || ""
    };
    
    const savedActivity = userStore.addActivityToUser(userId, newActivity);
    
    if (savedActivity) {
      logger.info(`Activity created for user ${userId}: ${savedActivity.name}`);
      response.redirect('/my-activities');
    } else {
      logger.error(`Failed to create activity for user ${userId}`);
      response.redirect(`/activity/add?error=${encodeURIComponent('Failed to create activity')}`);
    }
  },

  editActivityView(request, response) {
    const userId = request.session.user.id;
    const activityId = parseInt(request.params.id);
    
    logger.info(`Displaying edit form for activity ID: ${activityId}`);
    
    const activity = userStore.getUserActivity(userId, activityId);
    
    if (!activity) {
      logger.warn(`Activity ${activityId} not found for user ${userId}`);
      return response.redirect('/my-activities');
    }
    
    const viewData = {
      title: "Edit Activity",
      id: "edit-activity",
      activity: activity,
      error: request.query.error || null,
      user: request.session.user
    };
    
    response.render("activity-form", viewData);
  },

  updateActivity(request, response) {
    const userId = request.session.user.id;
    const activityId = parseInt(request.params.id);
    const { name, description, difficulty, image, details } = request.body;
    
    logger.info(`Processing update for activity ID: ${activityId}`);
    
    //  Validate required fields
    if (!name || !description || !difficulty) {
      return response.redirect(`/activity/edit/${activityId}?error=${encodeURIComponent('Name, description and difficulty are required')}`);
    }
    
    // FUNCTION -> create new activity with updated, barely works
    const updatedActivity = {
      name,
      description,
      difficulty,
      image: image || "/default-activity.jpg",
      details: details || ""
    };
    
    // Save new activity to user's collection
    const savedActivity = userStore.updateActivity(userId, activityId, updatedActivity);
    
    if (savedActivity) {
      logger.info(`Activity ${activityId} updated for user ${userId}`);
      response.redirect('/my-activities');
    } else {
      logger.error(`Failed to update activity ${activityId} for user ${userId}`);
      response.redirect(`/activity/edit/${activityId}?error=${encodeURIComponent('Failed to update activity')}`);
    }
  },

  deleteActivity(request, response) {
    const userId = request.session.user.id;
    const activityId = parseInt(request.params.id);
    
    logger.info(`Processing deletion for activity ID: ${activityId}`);
    // 2 Functions, first to delete overall(Above) second to delete from library of user(Below)
    const deletedActivity = userStore.deleteActivity(userId, activityId);
    
    if (deletedActivity) {
      logger.info(`Activity ${activityId} deleted for user ${userId}`);
    } else {
      logger.warn(`Failed to delete activity ${activityId} for user ${userId}`);
    }
    
    response.redirect('/my-activities');
  },

  // Add to user
  addGlobalActivity(request, response) {
    const userId = request.session.user.id;
    const globalActivityId = parseInt(request.params.id);
    
    logger.info(`Adding global activity ${globalActivityId} to user ${userId}`);
    
    const globalActivity = appData.activities.find(a => a.id === globalActivityId);
    
    if (!globalActivity) {
      logger.warn(`Global activity ${globalActivityId} not found`);
      return response.redirect('/dashboard?error=Activity not found');
    }
    
    // Check
    const user = userStore.findUserById(userId);
    const alreadyHasActivity = user.activities && user.activities.some(a => a.name === globalActivity.name);
    
    if (alreadyHasActivity) {
      logger.info(`User ${userId} already has activity ${globalActivity.name}`);
      return response.redirect('/dashboard?error=You already have this activity in your collection');
    }
    
    const activityCopy = {
      name: globalActivity.name,
      description: globalActivity.description,
      difficulty: globalActivity.difficulty,
      image: globalActivity.image,
      details: globalActivity.details
    };
    
    const savedActivity = userStore.addActivityToUser(userId, activityCopy);
    
    if (savedActivity) {
      logger.info(`Global activity ${globalActivity.name} added to user ${userId}`);
      response.redirect('/dashboard?success=Activity added to your collection');
    } else {
      logger.error(`Failed to add global activity to user ${userId}`);
      response.redirect('/dashboard?error=Failed to add activity');
    }
  }
};

    

export default activity;