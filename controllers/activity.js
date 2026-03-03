'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";

const activity = {
  createView(request, response) {
    const activityId = parseInt(request.params.id);
    logger.info(`Activity details page loading for ID: ${activityId}`);
    
  
    const foundActivity = appStore.activities.find( activity => activity.id === activityId);

    const viewData = {
      title: `${foundActivity.name} - Activity Details`,
      id: "activity",
      activity: foundActivity
    };

    response.render("activity", viewData);
  }
};

    

export default activity;