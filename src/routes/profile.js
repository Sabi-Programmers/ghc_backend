import express from 'express';
import {
    changePassword,
    getAccountSettings,
    getProfile,
    updateProfile,
    updateProfilePhoto,
} from '../controllers/profile.js';
import {
    validateAuth,
    validateChangePassword,
    validateUpdateProfile,
} from '../validators/authValidators.js';
import { uploadImage } from '../middlewares/upload.js';

const profileRouter = express.Router();

profileRouter.get('/', getProfile);
profileRouter.post('/', validateUpdateProfile, validateAuth, updateProfile);
profileRouter.post('/photo', uploadImage.single('photo'), updateProfilePhoto);
profileRouter.get('/account-settings', getAccountSettings);
profileRouter.post(
    '/change-password',
    validateChangePassword,
    validateAuth,
    changePassword,
);

export default profileRouter;
