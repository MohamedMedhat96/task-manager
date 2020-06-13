const Task = require('../src/models/task')

require('../src/db/mongoose')


//5ee2d31f03adf622cc03debe

// Task.findByIdAndDelete("5ee2db3dcdc3171244f0906a").then((user)=>{
//     console.log(user)
//     return Task.countDocuments({completed:false})
// }).then((result)=>{
//     console.log(result)
// }).catch((err)=>{
//     console.log(err)
// }) 

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}
yield
deleteTaskAndCount('5ee2fff5692d8614a4a8a2f7').then((count) => {
    console.log(count)
}).catch((err) => {
    console.log(err)
})
