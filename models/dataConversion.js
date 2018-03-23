var query = require('./query');
var async = require('async');
var syncloop = require('./syncloop.js');
var attributeId = [];
var categoryId = [];

module.exports =
{
  attributeId, categoryId,
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
  processData: function(reqBody, reqUser)
  {
    syncloop.synchIt(attributeId.length, function(loop)
    {
      syncloop.synchIt1(categoryId.length, function(loop1)
      {
        var index = String(loop.iteration()+1) + String(loop1.iteration()+1);
        console.log(index);
        query.newQuery("INSERT INTO datavalues (Value, CategoryID, AttributeID, userID) VALUES('" + reqBody[index] + "'," + categoryId[loop1.iteration()] + "," + attributeId[loop.iteration()] + "," + reqUser.ID + ");",
        function(err,data)
        {
            loop1.next();
        });
      },function()
        {
            loop.next();
        })

    })
  }
}
