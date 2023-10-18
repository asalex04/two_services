import History from "../models/history.js";

class HistoryController {
    async createLog(req, res) {
        try {
            const { userId, method, date } = req.body
            const newLog = await History.create({
                userId,
                method,
                date
            })
            return res.status(201).send(newLog)
        } catch (error) {
            console.log(error)
        }
    }

    async getAll(req, res) {
        try {
            const { id, offset, limit } = req.query
            const logs = await History.findAll({
                where: { userId: id },
                order: [['logId', 'DESC']],
                offset,
                limit
            })
            return res.send(logs)
        } catch (error) {
            console.log(error)
        }
    }
}

export default new HistoryController()