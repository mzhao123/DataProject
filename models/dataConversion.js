var query = require('./query');
var async = require('async');
module.exports =
{
  makeTable: function(reqBody, reqUser, callback)
  {
    var row  = 1;
    var column = 1;
    var together = String(row) + String(column);
    var categoryNum = 1;
    //add category data into database first!
    var currentCategory = "category" + String(categoryNum);
    console.log(reqBody[currentCategory]);
    async.whilst(
      function() {return (reqBody[currentCategory] != null) },
        function(cb)
        {

          console.log(reqBody[currentCategory])
        query.newQuery("INSERT INTO categories (Description) VALUES('" + reqBody[currentCategory] + "');", function()
        {
          console.log('hi!');
        });
        categoryNum ++;
        currentCategory = "category" + String(categoryNum);
          cb(null, reqBody[currentCategory]);
        }
    );

    callback();
  },
  greeting: function()
  {

  }
}
