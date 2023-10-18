import express from 'express';
import 'dotenv/config'
import router from "./routers/historyRouter.js";
import {sequelize} from "./util/database.js";

const app = express();
const PORT = process.env.PORT || 4000

app.use(express.json())

app.use('/api', router)

const startApp = async () => {
    try {
        sequelize.sync().then(() => {
            app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
        })

    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

void startApp()