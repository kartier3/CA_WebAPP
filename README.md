
# Activity Finder Web Application

A web application for managing and tracking fitness activities with user profiles, activity tracking, and social features.

## Features

- User authentication (signup, login, logout)
- Dashboard with global activity browsing
- Personal activity management (create, edit, delete)
- Activity image upload with automatic resizing
- User profile management with profile picture upload
- View all users with statistics and sorting capabilities
- Activity search and filtering
- Activity difficulty tracking (Easy, Medium, Hard)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

The application will run on http://localhost:3000

## Usage

### User Registration and Login

- Navigate to the application and click "Sign Up" to create an account
- Fill in your first name, last name, email, and password
- After registration, use "Login" to access your account

### Managing Activities

- Browse available activities on the Dashboard
- Click "Add to Collection" to add activities to your personal list
- Access your activities through "My Activities"
- Create new activities with custom details and images
- Edit or delete your existing activities
- Upload activity images (automatically resized to 200px height)

### Profile Management

- Click on your name in the menu to access your profile
- Upload a profile picture (automatically resized to 200px height)
- View your profile information and statistics

### User Statistics

- Access "All Users" from the menu to view all registered users
- Sort users by name, email, activity count, or total duration
- View user statistics including activity count and member since date

## Technologies Used

- Node.js
- Express.js
- Handlebars (templating engine)
- Multer (file upload handling)
- Sharp (image processing)
- Express Session (session management)
- Bcrypt (password hashing)
- Winston (logging)

## Project Structure

```
CA_WebAPP/
├── controllers/          # Application logic controllers
│   ├── auth.js          # Authentication controller
│   ├── activity.js      # Activity management controller
│   ├── dashboard.js     # Dashboard controller
│   ├── profile.js       # Profile management controller
│   ├── users.js         # Users list controller
│   └── start.js         # Landing page controller
├── models/              # Data models and storage
│   ├── user-store.js    # User data management
│   └── app-store.json   # Global activities data
├── utils/               # Utility functions
│   ├── logger.js        # Winston logger configuration
│   └── image-utils.js   # Image processing utilities
├── views/               # Handlebars templates
│   ├── partials/        # Reusable template components
│   │   └── menu.hbs     # Navigation menu
│   ├── activity-form.hbs # Activity creation/edit form
│   ├── dashboard.hbs    # Dashboard page
│   ├── profile.hbs      # User profile page
│   └── users.hbs        # Users list page
├── public/              # Static files
│   └── uploads/         # Uploaded images directory
├── routes.js            # Application routes
├── server.js            # Server configuration
└── package.json         # Dependencies and scripts
```

## API Routes

### Authentication
- GET /signup - Display signup form
- POST /signup - Register new user
- GET /login - Display login form
- POST /login - Authenticate user
- GET /logout - Logout user

### Activities
- GET /dashboard - Display global activities
- GET /my-activities - Display user's activities
- GET /activity/add - Display add activity form
- POST /activity/add - Create new activity
- GET /activity/edit/:id - Display edit activity form
- POST /activity/edit/:id - Update activity
- POST /activity/delete/:id - Delete activity
- POST /activity/add-global/:id - Add global activity to user
- GET /activity/:id - Display activity details

### Profile
- GET /profile - Display user profile
- POST /profile/image - Upload profile picture

### Users
- GET /users - Display all users with statistics

## Data Storage

The application uses JSON files for data persistence:
- `models/user-store.json` - User accounts and their activities
- `models/app-store.json` - Global activities available to all users

## Image Upload

- Profile pictures are automatically resized to 200px height
- Activity images are automatically resized to 200px height
- Images are stored in the `public/uploads/` directory
- Supported formats: JPEG, JPG, PNG, GIF, WebP
- Maximum file size: 5MB

## Session Management

- Sessions are stored in memory
- Sessions expire after 24 hours
- Session cookies are HTTP-only for security
- Custom session name to avoid conflicts

## Logging

The application uses Winston for logging with different log levels:
- info: General information about application flow
- error: Error messages for debugging
- warn: Warning messages for potential issues

## Security

- Passwords are hashed using bcrypt
- Session cookies are HTTP-only
- User authentication required for protected routes
- Input validation on forms

## Development

To start the application in development mode with automatic restart on file changes:
```bash
npm start
```

The application uses nodemon for automatic server restart during development.

## Browser Compatibility

The application is designed to work on modern web browsers including Chrome, Firefox, Safari, and Edge.

## Contact

Email: radziholeg@gmail.com