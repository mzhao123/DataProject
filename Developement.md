# Microsoft Azure Cloud project

**By: Daniel Zhao (Software developer on a Cloud Platform, Co-op student from the University of Waterloo)**

**April, 2018**

**Some tips and tricks to solve most of the problems you will encounter:**

I have posted a link to another document made by another former co-op student: Haoda Fan. I myself read his guide and it helped me get started with development on the cloud.
Here is the link: https://github.com/mzhao123/IBMCLoudDemo-FNTPR-DANIEL/blob/master/so-you-want-to-be-a-software-dev-on-cloud-platform-for-mohltc-coop.md

# 1.0 HOW I DEVELOPED MY CLOUD PROJECT

I will explain the process on how I managed to develop a node.js express project and move it onto Microsoft Azure. This project was first developed on local host and then moved to Microsoft Azure.

## 1.1 Starting an express.js webpage on Azure

I worked closely with my mentor, Tony Xijierfu, while pushing our project to Microsoft Azure. First, we created created a expressjs app service plan on Microsoft Azure. we were able to name the app and select a service plan through the azure portal. After creating the app service plan, we proceeded to deploy it by using a local git repository. First, we created a git repository on Azure. Then, we cloned my project(local host project) that was on github and created a new local repository. After that, we pushed the local repository we just created to the git repository on Azure. Azure did the rest of the work. It recognized that we pushed a node.js project and automatically installed all of our project dependencies. We followed a course on Pluralsight, a learning website, which gave me step-by-step instructions to complete this webserver. The link is here:
  1. Tony and I had some difficulty deploying through a "zip transfer" because a web.config file was not automatically generated. By pushing through the local git repository, we were able to acquire the auto-generated web.config file, which allowed our project to run smoothly.
  2. Please be aware that some code regarding connection between the app and the host might be different between the code on this repository and the code on the azure cloud. This code on this repository is designed to function on a local host, unlike the code on azure.

##1.2 Setting up the mysql database

I created the database we used for this project on mysql workbench. To reuse existing connections and make the project more effective, I used a connection pool instead of a regular connection. To transfer the database from mysql workbench to the azure mysql database, we exported the data from workbench and transfered it into azure's mysql. Then, we connected the azure database with the application.
Here is the code to connect the database with the application itself (azure):


```javascript
var pool = mysql.createPool({
  host: 'gendataproj.mysql.database.azure.com',
  user: 'iamtheadmin@gendataproj',
  password: 'ThereIsNoCowLevel@2',
  database: 'dataproject',
  port: 3306,
  ssl: {
      ca: fs.readFileSync('./BaltimoreCyberTrustRoot.crt.pem')
  }
});
```

Compare this code to the code on local host:

```javascript

var pool = mysql.createPool({
  host: 'localhost',
  user: 'Daniel',
  password: 'hereisthepass',
  database: 'dataproject'
})

```
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
**NOTE:** I kind of reused code made by a previous intern Haoda Fan because we ended up working on the same project (I picked up where he left off). The test email account that sends emails is his account and the username and password are displayed above. If you want to change the account that sends emails, simply create a new email account and enter in its credentials in "sendmail.js". A problem that is occasionally encountered is the fact that google security locks the email account because a suspicious user has logged in (azure cloud is located in Montreal while we are in Toronto). To fix this, I just log into the account on gmail and verify the location that was used to log in.

##1.4 Some Areas of Improvement
  Just like everything other project, there are things that could be improved
  1. The front-end styling for the project is not the best, as I did not spend a lot of time on that.
  2. Currently, there is no way for an admin to delete forms. Perhaps that functionality could be developed. A problem with that is if a form is deleted, then all of the users who filled out the form should have their form information deleted as well.

# 2.0 Developing the forms
The idea of this project was to allow administrators to create customs forms that could be viewed and filled out by users. In order to do this, first, administrators are able to create pre-made categories and attributes that can fill up a table. These pre-made items are then able to be selected in a drop down menu for the table as seen here:

![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/formCreationExample.png)

As seen in the diagram, is it possible to add/delete columns as well as add/delete rows. Columns are added to the right, and also delete on the right as well. Rows will always be added at the bottom of the table, but the user can select which row he/she wants to delete. Something that I would have liked to implement was the option to switch rows around ( as seen by the up and down arrows)

After all of the attributes and categories are defined, the administrator can submit the form, and allow the form to be able to be filled by users. The administrator can name the form in the "group title" box by entering a UNIQUE title. Also, the administrator can select which group of users can view the form by filling out the gruop number box.

#2.1 Submitting forms
Non-admin users will be able to fill and submit forms with the same group number. This data that is submitted will be sent to the database under the "datavalues" table where the data itself, the category, attribute, user, and form ID are stored in. In addition to online submission on the browser, users will be able to transfer the form onto an excel sheet and fill it out from there. After they are done, they can upload the excel sheet and transfer the data back onto the online form.

#2.2 Editting forms
Forms that have already been filled out by users will be able to be edited by users later on. Please not that there will not be multiple versions of the same form filled by a user because the application automatically updates the database and does not add a new entry if a previous entry with the same form and user ID exists.

# 3.0 Conclusion
Hopefully this document will give you a good understanding of what this project is all about and will help you with your work here.
If you have any questions at all about this document, about your job here, the program I made, you can contact me at: mzhao8808@gmail.com. Hopefully I won't be too busy and forget to check my email. You can also text me at (815-909-9761) but beware that my number is from the United States, so it might be best to just email me.

Thank you and I hope you have a wonderful Co-op term!
