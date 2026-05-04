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

// NEW CODE: Authentication routes
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


router.get('/activity/:id', activity.createView);  

export default router;