module.exports = function(app)
{
  console.log("Server ready...");
  app.get("/", function(req, res)
  {
    res.render('testUI.html');
  });
  app.get("/table", function(req, res)
  {
    res.render('tablegrid.html');
  })
  app.get("/dynamic", function(req,res)
  {
    res.render('dynamictable.html');
  })
  app.get("/custom", function(req,res)
  {
    res.render('customtable.html');
  })
}
