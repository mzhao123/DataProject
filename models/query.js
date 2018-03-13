var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'Daniel',
  password: 'gogogo123',
  database: 'dataproject'
})
module.exports = {
  newQuery: function(query, callback)
  {
      connection.query(query, function(error, data)
      {
      if(error)
      {
       console.log("Query failure:" + query);
       throw error;
      }
      else
      {
          console.log("Query success: " + query);
          callback(error, data);
      }
      })


  }
}
