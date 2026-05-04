'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.json" with { type: "json" };
import userStore from "../models/user-store.js";

const dashboard = {
  createView(request, response) {
    logger.info("dashboard is loading");
    
    // NEW CODE: Get search and sort parameters from query string
    const searchQuery = request.query.search || '';
    const sortBy = request.query.sort || 'name';
    
    // NEW CODE: Debug logging to check if parameters are received
    logger.info(`Search query: "${searchQuery}", Sort by: "${sortBy}"`);
    
    let userActivities = [];
    if (request.session.user) {
      const user = userStore.findUserById(request.session.user.id);
      userActivities = user.activities || [];
    }
    
    // NEW CODE: Filter global activities based on search query
    let filteredActivities = appStore.activities;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredActivities = filteredActivities.filter(activity => 
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.difficulty.toLowerCase().includes(searchLower)
      );
      logger.info(`Filtered activities from ${appStore.activities.length} to ${filteredActivities.length}`);
    }
    
    // NEW CODE: Sort global activities based on sort parameter
    if (sortBy === 'name') {
      filteredActivities.sort((a, b) => a.name.localeCompare(b.name));
      logger.info(`Sorted by name`);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      filteredActivities.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      logger.info(`Sorted by difficulty`);
    }
    
    const viewData = {
      title: "Activity Dashboard",
      id: "dashboard",
      activities: filteredActivities,
      userActivities: userActivities,
      user: request.session.user,
      searchQuery: searchQuery,
      sortBy: sortBy
    };

    response.render("dashboard", viewData);
  },
};

export default dashboard;