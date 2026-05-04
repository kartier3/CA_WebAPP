'use strict';

import express from 'express';

import start from './controllers/start.js';
import dashboard from './controllers/dashboard.js';
import about from './controllers/about.js';
import faq from './controllers/FAQ.js';
import activity from './controllers/activity.js';
// ADD: Import authentication controller
import auth from './controllers/auth.js';  



const router = express.Router();

// Authentication routes
router.get('/signup', auth.signupView);
router.post('/signup', auth.register);
router.get('/login', auth.loginView);
router.post('/login', auth.login);
router.get('/logout', auth.logout);



//Public
router.get('/', start.createView);
router.get('/dashboard', dashboard.createView);
router.get('/about', about.createView);
router.get('/faq', faq.createView);

//Activities
router.get('/my-activities', auth.ensureAuthenticated, activity.listUserActivities);
router.get('/activity/add', auth.ensureAuthenticated, activity.createActivityView);
router.post('/activity/add', auth.ensureAuthenticated, activity.createActivity);
router.get('/activity/edit/:id', auth.ensureAuthenticated, activity.editActivityView);
router.post('/activity/edit/:id', auth.ensureAuthenticated, activity.updateActivity);
router.post('/activity/delete/:id', auth.ensureAuthenticated, activity.deleteActivity);
router.post('/activity/add-global/:id', auth.ensureAuthenticated, activity.addGlobalActivity);

// Global
router.get('/activity/:id', activity.createView);

export default router;