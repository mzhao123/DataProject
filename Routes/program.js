var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
module.exports = function(app, passport)
{
  console.log("Server ready...");
  app.get("/", function(req, res)
  {
    res.render('index.ejs');
  });
  app.get("/table", function(req, res)
  {
    res.render('tablegrid.ejs');
  })
  app.get("/dynamic", function(req,res)
  {
    res.render('dynamictable.ejs');
  })

  app.get("/custom", isLoggedIn, function(req,res)
  {
    var dataConv = require('../models/dataconversion.js');
    res.render('customtable.ejs');
  });
  app.post("/custom", function (req, res)
  {
    console.log(req.body);
    var dataConv = require('../models/dataconversion.js');
    if(req.user.admin == 1 || req.user.admin ==0)
    dataConv.makeData(req.body, req.user, function(attributeId, categoryId)
    {
      console.log("made the table!")
      res.redirect('/profile')
    });

  });
  //not actual profile yet

//passport stuff
  app.get("/login", function(req,res)
  {
    console.log("app get '/login'");
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  app.post("/login", passport.authenticate('local-login',
  {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash : true //flash messages are allowed
  }));
  // =====================================
   // SIGNUP ==============================
   // =====================================
  app.get('/signup', function(req, res)
  {
    //DEBUGGING
    console.log("app get /signup");
    console.log(req.body);
    console.log("ABOVE IS APP.GET SIGNUP ^^^^^!!!");
    res.render('signup.ejs', {message: req.flash('signupMessage'), message1: req.flash('signupMessage1') });
  });
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup',
  {
      successRedirect : '/validate',
      failureRedirect : '/signup',
      failureFlash : true //allows flash messages
    }));

    app.get('/validate', isLoggedIn, function(req, res)
    {
      console.log("app get /validation-required");
      var query = require('../models/query');
      var loginquery = require('../models/loginquery.js');
      var mail = require('../models/sendMail.js');

      //Now, let's generate a token
      loginquery.generateTokenObject(req.user.ID, 10, function(tokenObject)
      {
        console.log(tokenObject);
        query.newQuery("INSERT INTO token (UserId, TokenContent, Expiry) VALUES (" + tokenObject.ID + ", '" + tokenObject.token + "', '" + tokenObject.expiry + "');", function(err, data)
        {
          console.log("SUCCESS!");
          console.log(data);
        });
        console.log("Let's asynchronously also send the email");
        console.log(req.user.email);
        mail.sendFromHaodasMail(req.user.email, "First Nations Online Income Reports: User Validation Required!",
          "Please click on the following link: \n localhost:3000/validate-now?tok=" + tokenObject.token + " to validate yourself: "
        );
      });
      res.render('tobevalidated.ejs');
    });
    // =====================================
    // Validation ==========================
    // =====================================
    app.get('/validate-now', function(req, res)
    {
      console.log(req.query.tok);
      var query = require('../models/query');
      var tokenAuthen = require('../models/tokenauth');
      tokenAuthen.checkToken(res, req);
    });
    // =====================================
    // LOGIN =============================
    // =====================================
    app.get('/login', function(req, res)
    {
      console.log("app get '/login'");
      res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login',
    {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true //allow flash messages
    }));

    // =====================================
    // PROFILE =============================
    // =====================================
    app.get('/profile', isLoggedIn, function(req, res)
    {
      console.log("/GET PROFILE");
      //Check user
      console.log(req.user);
      var query = require('../models/query.js');
      var displayTables = require('../models/formRetriever.js');
      displayTables.getFormIndex(req.user, function(dataArray)
      {
        res.render('Profile.ejs',
        {
          user: req.user,
          data: dataArray
        });
      });
    });
    // ======================================
    // FILL FORM ============================
    // ======================================
    app.get('/fillForm', isLoggedIn, function(req, res)
    {
      var query = require ('../models/query.js');
      var retriever = require('../models/formRetriever.js');
      console.log(req.user);
      retriever.displayForm(req.user, req.query, function(categoryArray, attributeArray)
      {
        query.newQuery("SELECT Title FROM datatable WHERE Id= " + req.query.formId, function(error, formTitle)
        {
          console.log(formTitle);

          res.render('form.ejs',
          {
            title: formTitle,
            category: categoryArray,
            attribute: attributeArray
          });
        });
      });
    });
    app.post('/fillForm', isLoggedIn, function(req, res)
    {
      var convert = require ('../models/dataconversion.js');
      var retriever = require('../models/formRetriever.js');
      console.log(req.user);
      retriever.displayForm(req.user, req.query, function(categoryArray1, attributeArray1)
      {
        convert.processData(req.body, req.user, categoryArray1, attributeArray1, function()
        {
          console.log("all done baby!");
          res.redirect('/profile')
        })

      });
    })

    app.get('/upload', isLoggedIn, function(req, res){
      res.sendFile(path.join(__dirname, '../views/fileUpload.html'));
    });
    app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

    // ============================
    //helper funtions =============
    // ============================
    function isLoggedIn(req, res, next)
    {

  // if the user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();
    res.redirect('/');
    }

}
