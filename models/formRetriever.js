var query = require('./query');
var syncloop = require('./syncloop.js');
module.exports =
{
  //function might be useless for this project but I literally spent 1 hour figuring this out so I will keep it in here for Now
  //returns two "array of arrays" one for categories and one for attributes.
  //each index of the outer array represents eithers all of the attributes or all of the categories for one form
  getForm: function(reqUser, callback)
  {
    var attributeItems = [];
    var categoryItems = [];
    query.newQuery("SELECT * FROM datatable WHERE GroupNumber =" + reqUser.GroupNumber + ";", function(err, data)
    {
      console.log('Info is: ')
      console.log(data);
      if(data.length == 0)
      {
        console.log("You don't have any forms available to fill out!");
      }
      else
      {
        syncloop.synchIt(data.length, function(loop)
        {
          console.log(loop.iteration());
          query.newQuery("SELECT * FROM attributes WHERE datatableid =" + data[loop.iteration()].Id + ";", function(err, data1)
          {
            attributeItems.push(data1);
            loop.next();
          });
        })
        syncloop.synchIt(data.length, function(loop)
        {
          query.newQuery("SELECT * FROM categories WHERE datatableid =" + data[loop.iteration()].Id + ";", function(err, data2)
          {
            categoryItems.push(data2);
            if(loop.iteration() == data.length-1)
            {
                  callback(attributeItems, categoryItems);
            }
            loop.next();
          });
        })
      }
    });
  },
  //displays the form menu for the profile page
  getFormIndex: function(reqUser, callback)
  {
    query.newQuery("SELECT * FROM datatable WHERE GroupNumber =" + reqUser.GroupNumber + ";", function(err, data)
    {
      callback(data);
    });
  },
  displayForm: function(reqUser, reqQuery, callback)
  {
    if(reqUser.GroupNumber == reqQuery.formGroupNumber)
    {
      query.newQuery("SELECT * FROM categories WHERE datatableid =" + reqQuery.formId + " ORDER BY ID ;", function(err, data)
      {
        query.newQuery("SELECT * FROM attributes WHERE datatableid =" + reqQuery.formId + " ORDER BY ID;", function(err, data1)
        {
          // data --> categories data1 --> attributes
          callback(data, data1);
        })
      });
    }
    else
    {
        var data = [];
        var data1 = [];
        callback( data, data1);
    }
  },
  //returns a callback containing an array that has the titles of the forms that have been filled out
  getFilledForms: function ( reqUser, callback)
  {
    var filledForms = [];
    query.newQuery("SELECT * FROM datatable WHERE GroupNumber =" + reqUser.GroupNumber + " ORDER BY Id ;", function(err, data)
    {
      //syncloop allows for a synchronous for loop...yay!
      syncloop.synchIt(data.length, function(loop)
      {
        console.log(data);
        //query to see if a form exists or not not sure if the join/alias are necessary, but I put them in for some extra programming practice
        query.newQuery("SELECT d.value, a.description AS attributeDesc, c.description AS categoryDesc FROM datavalues d JOIN attributes a ON d.AttributeID = a.ID JOIN categories c ON d.CategoryID = c.ID WHERE a.datatableid =" + data[loop.iteration()].Id, function (err, data1)
        {
          //if form doesn't exist, skip
          if(data1.length == 0)
          {
            if(loop.iteration() == data.length-1)
            {
                  callback(filledForms);
                  console.log(data1);
            }
              loop.next();
          }
          //if form exists, we push the title to the array
          else if(data1.length > 0)
          {
            query.newQuery("SELECT Title FROM datatable WHERE Id =" + data[loop.iteration()].Id, function(err, data2)
            {
              console.log(data2[0].Title);
              filledForms.push(data2[0].Title);
              if(loop.iteration() == data.length-1)
              {
                    callback(filledForms);
              }
              loop.next();
            });
          }
        });
      });
    });
  },
  viewForm: function(reqUser, title, callback)
  {
    query.newQuery("SELECT * FROM datatable WHERE Title = '" + title + "';", function (err, data)
    {
      //some kind of error occured, user messed with query string, filled form was deleted...etc
      if(data.length != 1)
      {
        console.log("error, more than 1 form with the same name...dafaq?");
      }
      //so far so good if the else statement is accessed
      else
      {
        query.newQuery("SELECT d.value, a.description AS attributeDesc, a.ID AS attributeID, c.description AS categoryDesc, c.ID AS categoryID FROM datavalues d JOIN attributes a ON d.AttributeID = a.ID JOIN categories c ON d.CategoryID = c.ID WHERE a.datatableid =" + data[0].Id , function (err, data1)
        {
          callback(data1);
        });
      }
    })
  },
  submitFormEdit: function(reqBody, reqUser, formData, callback)
  {
    console.log("@#@#@#");
    syncloop.synchIt(formData.length, function(loop)
    {
      query.newQuery("UPDATE datavalues SET Value ='" + reqBody[loop.iteration()] + "' WHERE CategoryID =" + formData[loop.iteration()].categoryID + " AND AttributeID =" + formData[loop.iteration()].attributeID + " AND userID = " + reqUser.ID, function(err, data)
      {

        if(loop.iteration() == formData.length-1)
        {
           callback();
        }
        loop.next();
      });
    });
  }
}
