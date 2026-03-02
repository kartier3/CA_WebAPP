
'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };

const dashboard = {
  createView(request, response) {
    logger.info("dashboard is loading");
    
    const viewData = {
      title: "Activity Dashboard",
      id: "dashboard",
      activities: appData.activities,
    };

    response.render("dashboard", viewData);
  },
};

export default dashboard;
