import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import {
    changeUserPassword,
    deleteUserOtherSessions,
    getUserProfile,
    updateUserDisplayPhoto,
    updateUserProfile,
} from '../services/profileServices.js';
import response from '../utils/response.js';
import { deleteFile } from '../middlewares/upload.js';

const getProfile = asyncWrapper(async (req, res) => {
    let data = {
        user: null,
    };

    data.user = await getUserProfile(req.user.id);
    return res.render('member/profile/user-profile', {
        title: data.user.username,
        data,
    });
});

const updateProfile = asyncWrapper(async (req, res) => {
    try {
        const user = await updateUserProfile(req.user.id, req.body);
        if (!user) {
            return response.json(
                res,
                StatusCodes.OK,
                false,
                'Invalid password',
            );
        }
        return response.json(
            res,
            StatusCodes.OK,
            true,
            'Profile Updated Successfully',
        );
    } catch (err) {
        let error = 'something went wrong';

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (err.code === 'P2002') {
                if (err.meta.target.includes('accountNumber')) {
                    error = 'Account Number already exists';
                } else if (err.meta.target.includes('email')) {
                    error = 'Email already exists';
                } else if (err.meta.target.includes('phone')) {
                    error = 'Phone Number already exists';
                } else {
                    error = err.meta.target;
                }
            }
        }

        return response.json(res, StatusCodes.BAD_REQUEST, false, error);
    }
});

const getAccountSettings = asyncWrapper(async (req, res) => {
    let data = {
        user: req.user,
    };
    return res.render('member/profile/account-settings', {
        title: 'Account Settings',
        data,
    });
});

const changePassword = asyncWrapper(async (req, res) => {
    const { oldPassword, password } = req.body;
    const user = await changeUserPassword(req.user.id, oldPassword, password);
    if (!user) {
        return response.json(res, StatusCodes.OK, false, 'Invalid password');
    }
    await deleteUserOtherSessions(req);

    return response.json(
        res,
        StatusCodes.OK,
        true,
        'Password Changed Successfully',
    );
});
const updateProfilePhoto = asyncWrapper(async (req, res) => {
    const photo = req.file.filename;
    const olddisplayPhoto = req.user.displayPhoto;

    const user = await updateUserDisplayPhoto(req.user.id, photo);

    if (olddisplayPhoto) {
        deleteFile(olddisplayPhoto);
    }
    return response.json(
        res,
        StatusCodes.OK,
        true,
        'Profile Photo Updated',
        user,
    );
});

export {
    getProfile,
    updateProfile,
    changePassword,
    getAccountSettings,
    updateProfilePhoto,
};
