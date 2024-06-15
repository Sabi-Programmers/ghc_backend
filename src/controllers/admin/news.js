import { StatusCodes } from 'http-status-codes'
import asyncWrapper from '../../middlewares/asyncWrapper.js'
import {
    addNews,
    deleteSingleNews,
    getAllNews,
    getSinglenews,
} from '../../services/newsServies.js'
import { calculatePagination } from '../../utils/index.js'
import response from '../../utils/response.js'

const getUploadNews = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }
    return res.render('admin/news/upload-news', {
        title: 'Upload News',
        data,
    })
})

const getNews = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const currentPage = Number(req.query.page) || 1

    const { news, totalNews } = await getAllNews(currentPage)
    data.news = news

    data.pagination = calculatePagination(totalNews, currentPage, 10)

    return res.render('admin/news/all-news', {
        title: 'All News',
        data,
    })
})

const getANews = asyncWrapper(async (req, res, next) => {
    const data = {
        user: req.user,
    }

    const { slug } = req.params
    data.news = await getSinglenews(slug)

    if (!data.news) {
        return next()
    }
    return res.render('admin/news/single-news', {
        title: data.news.title,
        data,
    })
})

const createNews = asyncWrapper(async (req, res) => {
    try {
        const { title, description } = req.body
        const photo = req.file.filename
        const news = await addNews({ title, description, photo })

        return response.json(
            res,
            StatusCodes.CREATED,
            true,
            'News added successfully',
            { slug: news.slug }
        )
    } catch (error) {
        return response.json(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            true,
            'Something went wrong!',
            error.message
        )
    }
})

const deleteNews = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params
        await deleteSingleNews(Number(id))
        return response.json(
            res,
            StatusCodes.OK,
            true,
            'News deleted successfully'
        )
    } catch (error) {
        return response.json(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            true,
            'Something went wrong!',
            error.message
        )
    }
})

export { getNews, getANews, createNews, deleteNews, getUploadNews }
