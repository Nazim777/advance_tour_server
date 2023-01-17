import express from 'express'
import dotev from 'dotenv'
import {database} from './database/database.js'
import cors from 'cors'
import TourRouter from './Routes/TourRoutes.js'
dotev.config()
const app = express()



app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json())


// all routes
app.use('/api/v1',TourRouter)

database()


app.listen(process.env.PORT,()=>{
    console.log('server listening on port 5000')
})