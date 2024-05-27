import express from 'express';
import {
    createNews,
    deleteNews,
    getANews,
    getNews,
    getUploadNews,
} from '../../controllers/admin/news.js';
import { uploadImage } from '../../middlewares/upload.js';

const newsRouter = express.Router();

newsRouter.get('/upload', getUploadNews);

newsRouter.post('/upload', uploadImage.single('photo'), createNews);
newsRouter.get('/', getNews);
newsRouter.get('/:slug', getANews);
newsRouter.delete('/:id', deleteNews);

export default newsRouter;
