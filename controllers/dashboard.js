'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.json" with { type: "json" };
import userStore from "../models/user-store.js";

const dashboard = {
  createView(request, response) {
    logger.info("dashboard is loading");
    
    const searchQuery = request.query.search || '';
    const sortBy = request.query.sort || 'name';
    
    logger.info(`Search query: "${searchQuery}", Sort by: "${sortBy}"`);
    
    let userActivities = [];
    if (request.session.user) {
      const user = userStore.findUserById(request.session.user.id);
      userActivities = user.activities || [];
    }
    
    //  global activities on ur text
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
    
    //  Sort 
    if (sortBy === 'name') {
      filteredActivities.sort((a, b) => a.name.localeCompare(b.name));
      logger.info(`Sorted by name`);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      filteredActivities.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      logger.info(`Sorted by difficulty`);
    }
    
    // Calculate statistics for all collections
    const allStats = userStore.getAllStats();

    const viewData = {
      title: "Activity Dashboard",
      id: "dashboard",
      activities: filteredActivities,
      userActivities: userActivities,
      user: request.session.user,
      searchQuery: searchQuery,
      sortBy: sortBy,
      allStats: allStats
    };

    response.render("dashboard", viewData);
  },
};

export default dashboard;