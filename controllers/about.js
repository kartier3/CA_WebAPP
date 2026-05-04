'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };
import appStore from "../models/app-store.js";
import userStore from "../models/user-store.js";


const about = {
  createView(request, response) {
    logger.info("about page is loading");

    // Calculate simple statistics
    const allStats = userStore.getAllStats();
    const globalActivitiesCount = appData.activities.length;

    const viewData = {
      title: "About - CA1 Activity App",
      id: "about",
      creators: appData.info.creators,
      stats: appStore.getAppInfo(),
      allStats: allStats,
      globalActivitiesCount: globalActivitiesCount
    };

    response.render("about", viewData);
  },
};

export default about;