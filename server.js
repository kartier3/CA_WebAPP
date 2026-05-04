'use strict';

import express from 'express';
import routes from "./routes.js";
import logger from "./utils/logger.js";
import { create } from 'express-handlebars';
// NEW CODE: Import express-session for proper cookie-based session management
import session from 'express-session';

const app = express();
const port = 3000;

app.use(express.static("public"));

// NEW CODE: URL parsing middleware for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// NEW CODE: Configure express-session with memory store for session persistence
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours
    httpOnly: true // Prevent client-side JavaScript from accessing the cookie
  },
  name: 'activity-finder.sid' // Custom cookie name to avoid conflicts
}));

// NEW CODE: Middleware to make session available to views via res.locals
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const handlebars = create({extname: '.hbs'});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

handlebars.handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

app.use("/", routes);

app.listen(port, () => logger.info(`Your app is listening on port ${port}`));

