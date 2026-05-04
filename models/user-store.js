'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// user data and authentication
const userStore = {
  dbPath: path.join(__dirname, 'user-store.json'),
  
  loadUsers() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading user data:', error);
      return { users: [], stats: { totalUsers: 0, totalActivities: 0, userWithMostActivities: null, averageActivitiesPerUser: 0 } };
    }
  },
  
  saveUsers(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  },
  
  addUser(user) {
    const data = this.loadUsers();
    user.id = data.users.length + 1;
    user.createdAt = new Date().toISOString();
    
    data.users.push(user);
    
    // Update 
    data.stats.totalUsers = data.users.length;
    
    this.saveUsers(data);
    return user;
  },
  
  findUserByEmail(email) {
    const data = this.loadUsers();
    return data.users.find(user => user.email === email);
  },
  
  findUserById(id) {
    const data = this.loadUsers();
    return data.users.find(user => user.id === parseInt(id));
  },
  
  async validateUser(email, password) {
    const user = this.findUserByEmail(email);
    
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        return user;
      }
    }
    
    return null;
  },
  
  addActivityToUser(userId, activity) {
    const data = this.loadUsers();
    const user = data.users.find(u => u.id === parseInt(userId));
    
    if (user) {
      if (!user.activities) {
        user.activities = [];
      }
      
      activity.id = user.activities.length + 1;
      activity.createdAt = new Date().toISOString();
      
      user.activities.push(activity);
      
      this.saveUsers(data);
      return activity;
    }
    
    return null;
  },
  
  updateActivity(userId, activityId, updatedActivity) {
    const data = this.loadUsers();
    const user = data.users.find(u => u.id === parseInt(userId));
    
    if (user && user.activities) {
      const activityIndex = user.activities.findIndex(a => a.id === parseInt(activityId));
      
      if (activityIndex !== -1) {
        updatedActivity.id = user.activities[activityIndex].id;
        updatedActivity.createdAt = user.activities[activityIndex].createdAt;
        updatedActivity.updatedAt = new Date().toISOString();
        
        user.activities[activityIndex] = updatedActivity;
        
        this.saveUsers(data);
        return updatedActivity;
      }
    }
    
    return null;
  },
  
  deleteActivity(userId, activityId) {
    const data = this.loadUsers();
    const user = data.users.find(u => u.id === parseInt(userId));
    
    if (user && user.activities) {
      const activityIndex = user.activities.findIndex(a => a.id === parseInt(activityId));
      
      if (activityIndex !== -1) {
        const deletedActivity = user.activities.splice(activityIndex, 1)[0];
        
        user.activities.forEach((activity, index) => {
          activity.id = index + 1;
        });
        
        this.saveUsers(data);
        return deletedActivity;
      }
    }
    
    return null;
  },
  
  getUserActivity(userId, activityId) {
    const user = this.findUserById(userId);
    
    if (user && user.activities) {
      return user.activities.find(a => a.id === parseInt(activityId));
    }
    
    return null;
  },
  
  updateStats() {
    // This will be expanded later, as there is no activity tracking yet
    const data = this.loadUsers();


    data.stats.totalUsers = data.users.length;
    this.saveUsers(data);
  }
};

export default userStore;
