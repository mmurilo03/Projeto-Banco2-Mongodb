const express = require("express")
const cors = require("cors")
const app = express()
app.use(express.json())
const port = 3000
const PointRouter = require("../routes/PointRouter")

app.use(cors())
app.use("/pontos", PointRouter)

app.listen(3000, () => console.log('App executando'))