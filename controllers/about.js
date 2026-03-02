'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };

const about = {
  createView(request, response) {
    logger.info("about page is loading");

    const viewData = {
      title: "About - CA1 Activity App",
      id: "about",
      creators: appData.info.creators,
      stats: appData.appStats
    };

    response.render("about", viewData);
  },
};

export default about;