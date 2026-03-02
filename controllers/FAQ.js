'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";


const faq = {
  createView(request, response) {
    logger.info("FAQ loading");

    const viewData = {
      title: appStore.getAppInfo(),
    };

    response.render("faq", viewData);
  },
};

export default faq;