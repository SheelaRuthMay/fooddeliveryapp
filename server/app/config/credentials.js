const SMTPTransport = require("nodemailer/lib/smtp-transport")

module.exports = {
    emailConf: new SMTPTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        type: "SMTP",
        port: 465,
        secure: false,
        auth: {
            user: 'srruthsheela7@gmail.com',
            pass: 'vvjzamwitvkxvfol'
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    })
};