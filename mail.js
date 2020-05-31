var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'singlayogita0@gmail.com',
    pass: 'nlqcvntficmntijn'
  }
});

var mailOptions = {
  from: 'singlayogita0@gmail.com',
  to: 'aggarwal7m@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});