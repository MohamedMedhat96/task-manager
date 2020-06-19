const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should sign up a user', async () => {
    const res = await request(app).post('/users').send({
        name: "Mohamed Medhat",
        email: "medhat.hamed96@gmail.com",
        password: "bagrbkedaaaa"
    }).expect(201)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()
    expect(res.body).toMatchObject({
        user: {
            name: "Mohamed Medhat",
            email: "medhat.hamed96@gmail.com",
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('bagrbkedaaaa')
})

test('Should log in user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email, password: userOne.password
    }).expect(200)
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('Shouldnt login, user not found', async () => {
    await request(app).post('/users/login').send({
        email: "hello@gmail.com",
        password: "ghalatyabaa"
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test('Should not get user profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should be able to delete', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()

})

test('Should not be able to delete', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload picture', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOne._id)

    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update valid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: "Updated" })
        .expect(200)
    const user = await User.findById({ _id: userOne._id })
    expect(user.name).toBe("Updated")
})
test('Update valid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: "Updated" })
        .expect(400)
    const user = await User.findById({ _id: userOne._id })
    expect(user.location).toEqual(undefined)
})

