const mongooose = require('mongoose')
const connectionUrl = 'mongodb://127.0.0.1:27017/task-manager'

mongooose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

