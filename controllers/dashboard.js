'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.json" with { type: "json" };
import userStore from "../models/user-store.js";

const dashboard = {
  createView(request, response) {
    logger.info("dashboard is loading");
    
    let userActivities = [];
    if (request.session.user) {
      const user = userStore.findUserById(request.session.user.id);
      userActivities = user.activities || [];
    }
    
    const viewData = {
      title: "Activity Dashboard",
      id: "dashboard",
      activities: appStore.activities,
      userActivities: userActivities,
      user: request.session.user
    };

    response.render("dashboard", viewData);
  },
};

export default dashboard;