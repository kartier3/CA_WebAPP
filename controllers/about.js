'use strict';

import logger from "../utils/logger.js";

const about = {
  createView(request, response) {
    logger.info("about page is loading");

    const viewData = {
      title: "About",
    };

    response.render("about", viewData);
  },
};

export default about;