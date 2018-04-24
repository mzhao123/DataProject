# DataProject
By Daniel Zhao
# Purpose
The purpose of this project/application is to create an easier way for users to submit forms to the government. When entering in a form, the user has two choices: the first choice is to fill in the form on the browser and the second choice is to convert the table into an excel sheet and fill it in later. Both the table in the browser and the excel sheet can be read and have their information sent to a database.

## Local Host
This project is currently being developed on a local host, but eventually we would like to built and deploy it for a cloud platform

## Language
The logic of this application is mainly done in Javascript and Java might be implemented later on. Tools used:
- Server-side logic: *Node.JS*
- Framework: *ExpressJS*
- User authentication: PassportJS
- Front-end templating engine: EJS
- Front-end CSS: *Bootstrap*


## database
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/database.png)

## Overview of tables
- user: Contains user's information entered in the sign-up page. GroupNumber tells us what group of forms the user can fill out.
- token: User validation is done here.
- datavalues: When a user submits a form, the data is stored in this table .
- attributes: Table that stores attributes in forms. datatableid tells us what form the attribute belongs to.
- categories: Table that stores categories in forms. datatableid tells us what form the category belongs to.
- datatable: Represents a form with a title and a group number that tells us what group of users can fill the form
# Current stage of development
### Completed features:
- Signup page
- Password reset
- Form generation
- Export forms to excel
- Import excel files and convert it to a form
- Form submission to a database

### Possible far-fetched future features:
- The ability to select specific users to be able to view/edit forms
- A way to create admin users without accessing the database directly
- Delete forms that have been created along with the data from completed forms that users filled out in the past
- Allow multiple groups to view the same form. This will probably require a many-many relationship in the database.
- Currently, when an admin tries to create a form with a duplicate title, an error message pops up and the page is refreshed without the dynamically created form. Perhaps there is a way to refresh the page and keep the data?

# Current features that users can implement

### Sign up:
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/Signup.png)

### view your profile and available forms:
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/profile.png)

### dynamic table creation (admin only):
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/EditableForm.png)

### Submit custom-generated forms:
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/emptyform.png)

### export/import forms to excel:
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/excelfunctionality.png)

### attribute and category creation:
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/attributeAndCategoryCreation.png)

### edit/view filled forms
![Table](https://raw.githubusercontent.com/mzhao123/DataProject/master/pictures/filledForms.png)

# Credit
### Thanks to:
- My manager, Sam Shen, for providing me with the guidance and resources needed for this project
- My co-worker/mentor Tony Xijierfu, for providing me step-by-step guidance and working with me to push the application to Azure
- You, for being interested in this project.
