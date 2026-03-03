'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };


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
  }
};

    

export default activity;