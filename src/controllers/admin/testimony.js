import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { getAllTestimony } from '../../services/testimonyServices.js'
import { calculatePagination } from '../../utils/index.js'

const getPendingTestimoniesPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const searchQuery = req.query.q || null
    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page

    const { testimonies, totalItem } = await getAllTestimony(
        page,
        perPage,
        searchQuery
    )

    data.testimonies = testimonies
    data.q = searchQuery

    data.pagination = calculatePagination(totalItem, page, perPage)

    res.render('admin/testimony/pending', {
        title: 'Pending Testimonies',
        data,
    })
})

export { getPendingTestimoniesPage }
