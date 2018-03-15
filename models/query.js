var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'Daniel',
  password: 'gogogo123',
  database: 'dataproject'
})
module.exports = {
  newQuery: function(query, callback)
  {
      pool.getConnection(function(err, connection) {
      if (err) return callback(err);
      pool.query(query, function(error, data)
      {
      if(error)
      {
        connection.release();
        console.error(error);
        callback(error, data);
      }
      else
      {
          console.log("Query success: " + query);
          connection.release();
          callback(error, data);
      }
      })
      });

  }
}
