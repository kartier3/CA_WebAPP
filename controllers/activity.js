'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };

const activity = {
  createView(request, response) {
    const activityId = parseInt(request.params.id);
    logger.info(`Activity details page loading for ID: ${activityId}`);
    
    // Find the activity with matching ID in the JSON data
    const foundActivity = appData.activities.find(activity => activity.id === activityId);
    
    // Check if activity was found
    if (foundActivity) {
      // Activity exists - show details page
      const viewData = {
        title: `${foundActivity.name} - Activity Details`,
        id: "activity",
        activity: foundActivity
      };
      response.render("activity", viewData);
    } else {
      // Activity not found - show 404 page
      logger.error(`Activity with ID ${activityId} not found`);
      response.status(404).render("404-view", {
        title: "Activity Not Found",
        id: "404"
      });
    }
  }
};

export default activity;