'use strict';

import logger from "../utils/logger.js";
import userStore from "../models/user-store.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadDir = path.resolve(__dirname, '../public/uploads');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}




const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

const profile = {
  createView(request, response) {
    logger.info("Displaying profile page");
    
    if (!request.session.user) {
      return response.redirect('/login?error=Please login to view your profile');
    }
    
    const user = userStore.findUserById(request.session.user.id);
    
    const viewData = {
      title: "My Profile",
      id: "profile",
      user: user,
      error: request.query.error || null,
      success: request.query.success || null
    };

    response.render("profile", viewData);
  },

  async updateProfileImage(request, response) {
    logger.info("Processing profile image update");
    
    if (!request.session.user) {
      return response.redirect('/login?error=Please login to update your profile');
    }
    
    if (!request.file) {
      logger.error("No file uploaded");
      return response.redirect('/profile?error=No file uploaded');
    }
    
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = 'profile-' + uniqueSuffix + path.extname(request.file.originalname);
      const filepath = path.join(uploadDir, filename);
      
      logger.info(`Writing file to: ${filepath}`);
      logger.info(`Upload directory exists: ${fs.existsSync(uploadDir)}`);
      
      // Resize image to 200px height with cover fit
      const resizedImage = await sharp(request.file.buffer)
        .resize({ height: 200, fit: 'cover' })
        .toBuffer();
      
      fs.writeFileSync(filepath, resizedImage);
      
      logger.info(`File successfully written and resized: ${filename}`);
      
      const user = userStore.updateUser(request.session.user.id, {
        profileImage: '/uploads/' + filename
      });
      
      request.session.user.profileImage = user.profileImage;
      
      logger.info(`Profile image updated for user: ${user.email}, file: ${filename}`);
      response.redirect('/profile?success=Profile image updated successfully');
    } catch (error) {
      logger.error("Error updating profile image:", error);
      response.redirect('/profile?error=Failed to update profile image: ' + error.message);
    }
  }
};

export { upload };
export default profile;
