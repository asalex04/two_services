import { Router } from 'express'
import historyController from '../controllers/historyController.js'

const router = Router()

router.post('/', historyController.createLog)
router.get('/', historyController.getAll)

export default router