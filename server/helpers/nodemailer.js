const nodemailer = require('nodemailer')

module.exports = {
    Mailer: (Email) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.email,
                pass: process.env.emailPassword
            }
        });

        var mailOptions = {
            from: Email.ownerEmail,
            to: Email.targetEmail,
            subject: `Project Invitation`,
            text: `${Email.ownerEmail} invite you to join this Project`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}