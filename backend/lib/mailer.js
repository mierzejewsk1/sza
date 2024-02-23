const config = require('./mailerConfig');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
const path = require('path');

const sendHTMLMail = (sender, address, subject, html) => {
  return new Promise((resolve, reject) => {
    const transportConfiguration = config.mailer[sender];

    if (transportConfiguration === undefined || transportConfiguration === null) return reject(new Error(`${sender} configuration does not exist`));

    const transporter = nodemailer.createTransport(smtpTransport(transportConfiguration));

    const mail = {
      from: sender,
      to: address,
      subject: subject,
      html: html,
    }

    transporter.sendMail(mail, (error, info) => {
      if (error) return reject(error);
      else return resolve(info);
    });
  })
}

const loadTemplate = (templateName, variables = null) => new Promise((resolve, reject) => {
  let templatePath = path.join(__dirname, '../templates', templateName);

  fs.readFile(templatePath, { encoding: 'utf-8' }, (error, data) => {
    if (error) return reject(error);

    if (variables !== null) return resolve(templateReplace(data, variables));

    return resolve(data);
  })
})

const templateReplace = (template, variables) => {
  let parsedTemplate = template;

  for (let key of Object.keys(variables)) parsedTemplate = parsedTemplate.replace(new RegExp(`%${key}%`, 'g'), variables[key]);

  return parsedTemplate;
}

module.exports = {
  sendHTMLMail,
  loadTemplate,
  templateReplace
}