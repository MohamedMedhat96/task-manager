require('../src/db/mongoose')
const User = require('../src/models/user')


//5ee2d31f03adf622cc03debe

// User.findByIdAndUpdate("5ee2d31f03adf622cc03debe",{age:24}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:24})
// }).then((result)=>{
//     console.log(result)
// }).catch((err)=>{
//     console.log(err)
// })


const updateAgentAndCound = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count

}

updateAgentAndCound("5ee2d31f03adf622cc03debe", 2).then((cout) => {
    console.log(cout)
}).catch((err) => {
    console.log(err)
})

