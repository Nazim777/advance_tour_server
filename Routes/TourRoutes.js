import express from 'express'
const router = express.Router()
import { getAllTour,getTourStats ,getMonthlyPlan} from '../Controller/TourController.js'

router.get('/',getAllTour)
router.get('/tour-stats',getTourStats)
router.get('/monthly-plan/:year',getMonthlyPlan)

export default router