var CronJob = require('cron').CronJob;
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "sandeep@sjinnovation.com",
        pass: "123Sjgoa"
    }
});

//var emailArray = ['sandeep@sjinnovation.com', 'kksandyrox@gmail.com'];

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "sandeep@sjinnovation.com", // sender address
    to: "sandeepnodetest@mailinator.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}
new CronJob('50 51 16 * * *', function(){
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
    	console.log("Email will be sent every second! SPAM SPAM SPAM");
    	console.log("");
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
})
}, null, true, "America/Los_Angeles");;




// create reusable transport method (opens pool of SMTP connections)

// send mail with defined transport object
// smtpTransport.sendMail(mailOptions, function(error, response){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Message sent: " + response.message);
//     }

//     // if you don't want to use this transport object anymore, uncomment following line
//     //smtpTransport.close(); // shut down the connection pool, no more messages
// });