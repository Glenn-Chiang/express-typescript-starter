import express from "express"
import cors from "cors"
import morgan from "morgan"
import {configDotenv} from "dotenv"
import { errorHandler } from "./middleware/errorHandler.js"
configDotenv()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// use routers here

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
