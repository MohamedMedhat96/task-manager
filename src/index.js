const express = require('express')

require('./db/mongoose')
const app = express()
const userRouter = require('./routers/userRoute')
const taskRouter = require('./routers/taskRoute')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)


app.listen(port, () => {
    console.log("server is listening on port" + port)
})