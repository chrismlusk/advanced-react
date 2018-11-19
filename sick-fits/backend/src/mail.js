const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

const emailTemplate = text => `
  <div className="email" style="
    border: 1px solid black;
    font-family: sans-serif;
    font-size: 18px;
    line-height: 1.5;
    padding: 20px;
  ">
    <h2>Howdy! 👋🏼</h2>
    <p>${text}</p>
  </div>
`;

exports.transport = transport;
exports.emailTemplate = emailTemplate;
