'use strict';

import logger from "../utils/logger.js";
import appData from "../models/app-store.json" with { type: 'json' };
import appStore from "../models/app-store.js";

const about = {
  createView(request, response) {
    logger.info("about page is loading");

    const viewData = {
      title: "About - CA1 Activity App",
      id: "about",
      creators: appData.info.creators,
      stats: appStore.getAppInfo()
    };

    response.render("about", viewData);
  },
};

export default about;