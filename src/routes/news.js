import express from 'express'
import { getNews } from '../controllers/news.js'

const newsRouter = express.Router()

newsRouter.get('/', getNews)

export default newsRouter
