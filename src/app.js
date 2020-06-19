const express = require('express')

require('./db/mongoose')
const app = express()
const userRouter = require('./routers/userRoute')
const taskRouter = require('./routers/taskRoute')

app.use(express.json())
app.use('/tasks', taskRouter)
app.use('/users', userRouter)

module.exports = app