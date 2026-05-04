'use strict';

import logger from "../utils/logger.js";
import userStore from "../models/user-store.js";

const users = {
  createView(request, response) {
    logger.info("Displaying users page");
    
    if (!request.session.user) {
      return response.redirect('/login?error=Please login to view users');
    }
    
    // Get sort parameter from query string
    const sortBy = request.query.sort || 'name';
    const direction = request.query.direction || 'asc';
    
    // Get all users with their statistics
    const allUsers = userStore.getAllUsers();
    
    // Add statistics to each user
    const usersWithStats = allUsers.map(user => {
      const stats = userStore.getUserStats(user.id);
      // Format createdAt to show only date (YYYY-MM-DD)
      const formattedDate = user.createdAt ? user.createdAt.split('T')[0] : '';
      return {
        ...user,
        stats: stats,
        activityCount: user.activities ? user.activities.length : 0,
        createdAt: formattedDate,
        originalCreatedAt: user.createdAt // Keep original for sorting
      };
    });
    
    // Sort users based on the selected field
    if (sortBy === 'name') {
      usersWithStats.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    } else if (sortBy === 'email') {
      usersWithStats.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortBy === 'activityCount') {
      usersWithStats.sort((a, b) => b.activityCount - a.activityCount);
    } else if (sortBy === 'date') {
      usersWithStats.sort((a, b) => a.originalCreatedAt.localeCompare(b.originalCreatedAt));
    }
    
    // Reverse the sort if direction is desc
    if (direction === 'desc') {
      usersWithStats.reverse();
    }
    
    const viewData = {
      title: "All Users",
      id: "users",
      currentUser: request.session.user,
      users: usersWithStats,
      sortBy: sortBy,
      direction: direction
    };
    
    response.render("users", viewData);
  }
};

export default users;
