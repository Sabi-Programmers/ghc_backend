import express from 'express'
import { getTeamPerformancePage } from '../../controllers/admin/cycle-performance.js'
const cyclePerformanceRouter = express.Router()

cyclePerformanceRouter.get('/team-performance', getTeamPerformancePage)

export default cyclePerformanceRouter
