import database from '../libs/prisma.js';
import slugify from 'slugify';
import { generateRandomString } from '../utils/index.js';

const getAllNews = async (page, isPublished) => {
    const skip = (page - 1) * 10;
    const filter = {};

    if (isPublished) {
        filter.isPublished = true;
    }

    const news = await database.news.findMany({
        where: filter,
        skip,
        take: 10,
        orderBy: { createdAt: 'desc' },
    });

    const totalNews = await database.news.count();

    return { news, totalNews };
};
const getAllPublishedNews = async () => {
    return await database.news.findMany({
        where: {
            isPublished: true,
        },

        orderBy: { createdAt: 'desc' },
    });
};

const getSinglenews = async (slug) => {
    return await database.news.findFirst({
        where: { slug },
    });
};

const addNews = async ({ title, description, photo }) => {
    const randomString = generateRandomString(4);
    const slug = slugify(title + ' ' + randomString, { lower: true });
    return await database.news.create({
        data: {
            title,
            description,
            photo,
            slug,
        },
    });
};

const deleteSingleNews = async (id) =>
    await database.news.delete({ where: { id } });

export {
    getAllNews,
    getSinglenews,
    addNews,
    deleteSingleNews,
    getAllPublishedNews,
};
