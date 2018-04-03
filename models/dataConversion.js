var query = require('./query');
var async = require('async');
var syncloop = require('./syncloop.js');
var attributeId = [];
var categoryId = [];

module.exports =
{
  attributeId, categoryId,
  // allows admin to create new forms
  makeData: function(reqBody, reqUser, callback)
  {
    var categoryNum = 1;
    var attributeNum = 1;
    attributeId = [];
    categoryId = [];
    //now we add data to the attributes table
    var currentAttribute = "Attribute" + String(attributeNum);
    //add category data into database first!
    var currentCategory = "category" + String(categoryNum);
    query.newQuery("INSERT INTO datatable (Title, GroupNumber) VALUES ('" + reqBody.groupTitle + "', " + reqBody.groupNumber + ");", function (err,data)
    {
    async.whilst(
      function() {return (reqBody[currentAttribute] != null) },
        function(cb)
        {

        query.newQuery("INSERT INTO attributes (Description, datatableid) VALUES('" + reqBody[currentAttribute] + "'," + data.insertId + " );", function(err, data1)
        {
          attributeId.push(data1.insertId);
          attributeNum ++;
          currentAttribute = "Attribute" + String(attributeNum);
          cb(null, reqBody[currentAttribute]);
        });
        },

        function(err)
        {
          async.whilst(
            function() {return (reqBody[currentCategory] != null) },
            function(cb)
            {
              query.newQuery("INSERT INTO categories (Description, datatableid) VALUES('" + reqBody[currentCategory] + "', " + data.insertId + ");", function(err, data2)
              {
                console.log(data);
                categoryId.push(data2.insertId);
                categoryNum ++;
                currentCategory = "category" + String(categoryNum);
                cb(null, reqBody[currentCategory]);
                if(reqBody[currentCategory] == null)
                {
                    callback(attributeId, categoryId);
                }
              });

            }
          );
        });
    })
  },
  //processes data in the form that user fills out and sends info to database
  //takes in 2 array parameters
  //used in the app.post(/fillForm) page in program.js
  processData: function(reqBody, reqUser, categoryArray, attributeArray, callback)
  {
    syncloop.synchIt(attributeArray.length, function(loop)
    {
      syncloop.synchIt1(categoryArray.length, function(loop1)
      {
        var index = String(loop.iteration()+1) + String(loop1.iteration()+1);
        console.log(index);
        query.newQuery("INSERT INTO datavalues (Value, CategoryID, AttributeID, userID) VALUES('" + reqBody[index] + "'," + categoryArray[loop1.iteration()].ID + "," + attributeArray[loop.iteration()].ID + "," + reqUser.ID + ");",
        function(err,data)
        {
            loop1.next();
            if(index == String(attributeArray.length) + String(categoryArray.length))
            {
              console.log(loop.iteration()+1);
              console.log(loop1.iteration()+1);
              callback();
            }
        });
      },function()
        {
            loop.next();

        })

    });
  },
  submitForm: function(reqBody, reqUser, reqQuery, arrayOne, arrayTwo, callback)
  {
    var rowIndex = 1;
    var colIndex = 1;
    var currentIndex = String(rowIndex) + String(colIndex);
    async.whilst(
      function(){return(reqBody[currentIndex] != null)},
      function(cb)
      {
        query.newQuery("INSERT INTO datavalues (Value, CategoryID, AttributeID, userID) VALUES ('" +reqBody[currentIndex] + "', )")
      }
    )
  },
  processExcel: function(reqBody, reqUser, callback)
  {

  }
}
