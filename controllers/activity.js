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
      activity: foundActivity
    };

    response.render("activity", viewData);
  },

  listUserActivities(request, response) {
    const userId = request.session.user.id;
    logger.info(`Loading activities for user ID: ${userId}`);
    
    const user = userStore.findUserById(userId);
    const activities = user.activities || [];
    
    const viewData = {
      title: "My Activities",
      id: "my-activities",
      activities: activities,
      user: request.session.user
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

  // NEW CODE: Process form submission and create new activity for the user
  createActivity(request, response) {
    logger.info("Processing new activity creation");
    
    const userId = request.session.user.id;
    const { name, description, difficulty, image, details } = request.body;
    
    // NEW CODE: Validate required fields
    if (!name || !description || !difficulty) {
      return response.redirect(`/activity/add?error=${encodeURIComponent('Name, description and difficulty are required')}`);
    }
    
    // NEW CODE: Create activity object with form data
    const newActivity = {
      name,
      description,
      difficulty,
      image: image || "/default-activity.jpg",
      details: details || ""
    };
    
    // NEW CODE: Save activity to user's collection
    const savedActivity = userStore.addActivityToUser(userId, newActivity);
    
    if (savedActivity) {
      logger.info(`Activity created for user ${userId}: ${savedActivity.name}`);
      response.redirect('/my-activities');
    } else {
      logger.error(`Failed to create activity for user ${userId}`);
      response.redirect(`/activity/add?error=${encodeURIComponent('Failed to create activity')}`);
    }
  },

  // NEW CODE: Display form for editing an existing activity
  editActivityView(request, response) {
    const userId = request.session.user.id;
    const activityId = parseInt(request.params.id);
    
    logger.info(`Displaying edit form for activity ID: ${activityId}`);
    
    // NEW CODE: Retrieve the specific activity belonging to this user
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

  // NEW CODE: Process form submission and update the activity
  updateActivity(request, response) {
    const userId = request.session.user.id;
    const activityId = parseInt(request.params.id);
    const { name, description, difficulty, image, details } = request.body;
    
    logger.info(`Processing update for activity ID: ${activityId}`);
    
    // NEW CODE: Validate required fields
    if (!name || !description || !difficulty) {
      return response.redirect(`/activity/edit/${activityId}?error=${encodeURIComponent('Name, description and difficulty are required')}`);
    }
    
    // NEW CODE: Create updated activity object preserving the original ID
    const updatedActivity = {
      name,
      description,
      difficulty,
      image: image || "/default-activity.jpg",
      details: details || ""
    };
    
    // NEW CODE: Save updated activity to user's collection
    const savedActivity = userStore.updateActivity(userId, activityId, updatedActivity);
    
    if (savedActivity) {
      logger.info(`Activity ${activityId} updated for user ${userId}`);
      response.redirect('/my-activities');
    } else {
      logger.error(`Failed to update activity ${activityId} for user ${userId}`);
      response.redirect(`/activity/edit/${activityId}?error=${encodeURIComponent('Failed to update activity')}`);
    }
  },

  // NEW CODE: Delete an activity from the user's collection
  deleteActivity(request, response) {
    const userId = request.session.user.id;
    const activityId = parseInt(request.params.id);
    
    logger.info(`Processing deletion for activity ID: ${activityId}`);
    
    // NEW CODE: Remove activity from user's collection
    const deletedActivity = userStore.deleteActivity(userId, activityId);
    
    if (deletedActivity) {
      logger.info(`Activity ${activityId} deleted for user ${userId}`);
    } else {
      logger.warn(`Failed to delete activity ${activityId} for user ${userId}`);
    }
    
    response.redirect('/my-activities');
  },

  // NEW CODE: Add a global activity from app-store.json to the user's personal collection
  addGlobalActivity(request, response) {
    const userId = request.session.user.id;
    const globalActivityId = parseInt(request.params.id);
    
    logger.info(`Adding global activity ${globalActivityId} to user ${userId}`);
    
    // NEW CODE: Find the global activity in app-store.json
    const globalActivity = appData.activities.find(a => a.id === globalActivityId);
    
    if (!globalActivity) {
      logger.warn(`Global activity ${globalActivityId} not found`);
      return response.redirect('/dashboard?error=Activity not found');
    }
    
    // NEW CODE: Check if user already has this activity
    const user = userStore.findUserById(userId);
    const alreadyHasActivity = user.activities && user.activities.some(a => a.name === globalActivity.name);
    
    if (alreadyHasActivity) {
      logger.info(`User ${userId} already has activity ${globalActivity.name}`);
      return response.redirect('/dashboard?error=You already have this activity in your collection');
    }
    
    // NEW CODE: Create a copy of the global activity for the user
    const activityCopy = {
      name: globalActivity.name,
      description: globalActivity.description,
      difficulty: globalActivity.difficulty,
      image: globalActivity.image,
      details: globalActivity.details
    };
    
    // NEW CODE: Add the activity to user's collection
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