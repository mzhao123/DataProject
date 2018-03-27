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
  }
}
