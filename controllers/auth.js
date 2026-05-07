'use strict';

import logger from "../utils/logger.js";
import userStore from "../models/user-store.js";

const auth = {
  
  signupView(request, response) {
    logger.info("Displaying  form");
    const viewData = {
      title: "Sign Up",
      id: "signup",
      error: request.query.error || null,
      success: request.query.success || null
    };

    response.render("signup", viewData);
  },

  async register(request, response) {
    logger.info("Processing user registration");
    
    const { 
      firstName,
       lastName,
        email,
         password,
          confirmPassword 
        } = request.body;
    // password: hashedPassword
    const errors = [];
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      errors.push("All fields are required");
    }
    
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    const existingUser = userStore.findUserByEmail(email);
    if (existingUser) {
      errors.push("A user with this email already exists");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (errors.length > 0) {
      return response.redirect(`/signup?error=${encodeURIComponent(errors.join(', '))}`);
    }
    
    const newUser = {
      firstName,
      lastName,
      email,
      password, // password will be hashed when bcrypt is installed
      profileImage: "/default-profile.jpg", 
      activities: [], // User's personal activities collection
      createdAt: new Date().toISOString()
    };
    //Was supposed to be password: hashedPassword but did not understand
    
    try {
      const user = userStore.addUser(newUser);
      logger.info(`New user registered: ${user.email}`);
      response.redirect(`/signup?success=${encodeURIComponent('Registration successful! Please login.')}`);
    } catch (error) {
      logger.error("Error registering user:", error);
      response.redirect(`/signup?error=${encodeURIComponent('Registration failed. Please try again.')}`);
    }
  },

  loginView(request, response) {
    logger.info("Displaying login form");
    
    const viewData = {
      title: "Login",
      id: "login",
      error: request.query.error || null,
      success: request.query.success || null
    };

    response.render("login", viewData);
  },

  login(request, response) {
    logger.info("Processing user login");
    
    const { 
      email,
       password } = request.body;
    
    if (!email || !password) {
      return response.redirect(`/login?error=${encodeURIComponent('Email and password are required')}`);
    }
    
    const user = userStore.findUserByEmail(email);
    
    if (user && user.password === password) {
      request.session.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage
      };
      
      request.session.save((err) => {
        if (err) {
          logger.error("Error saving session:", err);
        }
        logger.info(`User logged in: ${user.email}`);
        response.redirect('/dashboard');
      });
    } else {
      logger.warn(`Login failed for email: ${email}`);
      response.redirect(`/login?error=${encodeURIComponent('Invalid email or password')}`);
    }
  },

  logout(request, response) {
    logger.info("Processing user logout");
    
    request.session.destroy((err) => {
      if (err) {
        logger.error("Error destroying session:", err);
      }
      
      logger.info("User logged out successfully");
      response.redirect('/login?success=You have been logged out successfully');
    });
  },

  ensureAuthenticated(request, response, next) {
    logger.info(`ensureAuthenticated check - session exists: ${!!request.session}, session.user exists: ${!!request.session?.user}`);
    
    if (request.session.user) {
      return next();
    }
    
    logger.warn("Unauthorized access attempt");
    response.redirect('/login?error=Please login to access this page');
  }
};

export default auth;
