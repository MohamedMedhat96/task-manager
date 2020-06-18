const mongooose = require('mongoose')
const connectionUrl = process.env.MONGODB_URL

mongooose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

