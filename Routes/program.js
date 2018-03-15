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

  app.get("/custom", function(req,res)
  {
    res.render('customtable.ejs');
  })
  app.post("/custom", function (req, res)
  {
    
  })
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
      //Check user
      console.log(req.user);
      var query = require('../models/query.js');
      console.log("/GET PROFILE");
      res.render('Profile.ejs',
      {
        user: req.user
      });
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
