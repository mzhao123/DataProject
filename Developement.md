# Microsoft Azure Cloud project

**By: Daniel Zhao (Software developer on a Cloud Platform, Co-op student from the University of Waterloo)**

**April, 2018**

**Some tips and tricks to solve most of the problems you will encounter:**

I have posted a link to another document made by another former co-op student: Haoda Fan. I myself read his guide and it helped me get started with development on the cloud.
Here is the link: https://github.com/mzhao123/IBMCLoudDemo-FNTPR-DANIEL/blob/master/so-you-want-to-be-a-software-dev-on-cloud-platform-for-mohltc-coop.md

# 1.0 HOW I DEVELOPED MY CLOUD PROJECT

I will explain the process on how I managed to develop a node.js express project and move it onto Microsoft Azure. This project was first developed on local host and then moved to Microsoft Azure

## 1.1 Starting an express.js webpage on Azure

I worked closely with my mentor, Tony Xijierfu while pushing our project to Microsoft Azure. First, we created created a expressjs app service plan on Microsoft Azure. we were able to name the app and select a service plan through the azure portal. After creating the app service plan, we proceeded to deploy it by using a local git repository. First, we created a git repository on Azure. Then, we cloned my project(local host project) that was on github and created a new local repository. After that, we pushed the local repository we just created to the git repository on Azure. Azure did the rest of the work. It recognized that we pushed a node.js project and automatically installed all of our project dependencies. We followed a course on Pluralsight, a learning website, which gave me step-by-step instructions to complete this webserver. The link is here:
  1. Tony and I had some difficulty deploying through a "zip transfer" because a web.config file was not automatically generated. By pushing through the local git repository, we were able to acquire the auto-generated web.config file, which allowed our project to run smoothly.

##1.2 Setting up the mysql database

I created the database we used for this project on mysql workbench. To reuse existing connections and make the project more effective, I used a connection pool instead of a regular connection.
### 1.2.3 How to Query in your Node program

Querying is simple with the mysql API, and there are many online tutorials on how to do so.

Here is the super duper condensed version:
```javascript
//Assuming the you named the same variable 'connection' as the previous code examples have
connection.query(anyQueryString, function(error, dataReturnedByQuery) {
	//Code here is executed after you query
	console.log(dataReturnedByQuery); //That variable is anything returned by MySQL as a result of your query
});
```

##1.3 User Authenticaation with Passport
The way I developed user authentication was extremely similar to a previous co-op student, Haoda Fan's implementation of passport.js on the FNTPR cloud project. I based the code on Haoda's own source code for the FNTPR-Cloud project and [this tutorial](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)

The PassportJS tutorial uses MangoDB/ Mongoose as their databases, but at MOHLTC we prefer to use MS SQL, ORACLE SQL, or MYSQL so some code had to be changed from the tutorial.

In the tutorial, Mongoose related code like:

```javascript
// find a user whose email is the same as the forms email
// we are checking to see if the user trying to login already exists
User.findOne({ 'local.email' : email }, function(err, user) {
 //...
});
```

Would be replaced with:

```javascript
// Use a query to find a user whose email is the same as the forms email
query.newQuery("SELECT Email FROM user u WHERE u.Email LIKE '" + email + "';", function(error, user) {
	// Code here executes after you query ...
});

```
##1.3.1 Two-Factor Authentication
To enhance security, after a user signs up for an account with their email address, a link is sent to his/her inputted email. The user will have to click on the click to validate his/her account before being able to sign in and use account features.

To set up this authentication system, first I created a table called "token" in the mysql workbench. The token is linked to a user and has an expiry date. Then, I had to create a token by calling the bcrypt function in "loginquery.js", which is also used to encrypt the passwords. Finally, to send the token, I used "nodemailer". The nodemailer code is here:

```javascript
var nodeMailer = require('nodemailer'); //Import the module

//Sets up the mailing service (I created a new account for this)
var smtpTransport = nodeMailer.createTransport({
  service: "gmail", //hostname
  host: "smtp.gmail.com",
  auth: {
    user: "haodasdemo@gmail.com",
    pass: "godisdeadgodremainsdeadandwehavekilledhim" //I made that password specifically for that account and this program, so don't you go trying to access my bank account or something with it.
  }
})

//Here is the function for sending mail:
var mailConfig = {
	to : "target@email.com", //Whatever your target email is
	subject : "subject text",
	text : "whatever the content of your email is"
}
smtpTransport.sendMail(mailConfig, function(err, response) {
	if (err) {
		console.log(err)
	}
	else {
		//code here will execute after you sent the mail
	}
});

```
**NOTE:** I kind of reused code made by a previous intern Haoda Fan because we ended up working on the same project (I picked up where he left off). The test email account that sends emails is his account and the username and password are displayed above. If you want to change the account that sends emails, simply create a new email account and enter in its credentials in "sendmail.js".

##1.4 Some Areas of Improvement
  Just like everything other project, there are things that could be improved
  1. The front-end styling for the project is not the best, as I did not spend a lot of time on that.
  2. In order to view
