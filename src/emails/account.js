const sendgridAPIKey = process.env.SEND_GRID_API
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(sendgridAPIKey)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'medhat.hamed96@gmail.com',
        subject: "Welcome to Our Task Manager Application!",
        text: `Welcome to the app, ${name}. Please enjoy our application`
    })
}
const sendDeleteEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'medhat.hamed96@gmail.com',
        subject: "Awwww :(",
        text: `Goodbye ${name}, we are going to miss you`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}