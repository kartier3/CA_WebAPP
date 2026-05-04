'use strict';

import express from 'express';
import routes from "./routes.js";
import logger from "./utils/logger.js";
import { create } from 'express-handlebars';

const app = express();
const port = 3000;

app.use(express.static("public"));

// NEW CODE: URL parsing middleware for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// NEW CODE: Simple session simulation using memory (for development)
const sessions = {};
app.use((req, res, next) => {
  const sessionId = req.headers['session-id'];
  if (sessionId && sessions[sessionId]) {
    req.session = sessions[sessionId];
  } else {
    req.session = {};
  }
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

