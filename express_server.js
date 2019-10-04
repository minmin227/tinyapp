const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 5000;
const bcrypt = require('bcrypt');
const { checkEmail } = require('./helpers');
const { urlforUser } = require('./helpers');
const { generateRandomString } = require('./helpers.js');

//stretch work
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(cookieSession({
  name: 'session',
  keys: ['0128486513'],
  maxAge: 1000 * 60
}));
app.set('view engine', 'ejs'); //Encode the cookie session

//START: data
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", id: "aJ48lWF"},
  i3BoGr: { longURL: "https://www.google.ca", id: "aJ48lW"},
  b4UTxQ: { longURL: "https://www.haha.ca", id: "aJ48lWF"},
  b2UTxQ: { longURL: "https://www.caca.ca", id: "aJ48lW"}
};

const users = {
  "aJ48lWF": {
    id: "aJ48lWF",
    email: "user@example.com",
    password: "$2b$10$l18tZ4mpGC2AA0D0NjO79.GSbaJgC2gyG4oRjK8Dg1Q.Pe0gpmbFy"
  },
  "user2RandomID": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "$2b$10$ZGi.0nqXV0.SPMGu1JWcv.AW6753pOidA5dWQexHJ7x5Uho4Jrkj2"
  },
};


//END: data

app.get('/urls/new', (req, res) => {
  let urlUserDatabase = urlforUser(req.session.user_id);
  let templateVars = { urls: urlUserDatabase, user: users[req.session.user_id] };
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/urls', (req, res) => {
  let urlUserDatabase = urlforUser(req.session.user_id, urlDatabase);
  let templateVars = { urls: urlUserDatabase, user: users[req.session.user_id] };
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    res.render('urls_index', templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    let code = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id], date: (new Date()).toLocaleDateString()};
    res.render("urls_show", code);
  }
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  if (!(req.body.longURL)) {
    res.redirect(`/urls/new`);
  } else if ((req.body.longURL).includes('http://')) {
    urlDatabase[shortURL] = { longURL: `${req.body.longURL}`, id: req.session.user_id, date: (new Date()).toLocaleDateString() };
  } else {
    urlDatabase[shortURL] = { longURL: `http://${req.body.longURL}`, id: req.session.user_id, date:(new Date()).toLocaleDateString() };
  }
  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:shortURL', (req, res) => {
  let link = urlDatabase[req.params.shortURL].longURL;
  res.redirect(link);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});

app.get('/urls/:shortURL/edit', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    let code = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id], date: (new Date()).toLocaleDateString()};
    res.render("urls_show", code);
  }
});

app.post('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = req.body.newlongURL;
  }
  res.redirect('/urls');
});


app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.render('urls_register', templateVars);
  }
});

app.post('/register', (req, res) => {
  let idNum = generateRandomString(4);
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Please fill your password and email');
  } else if (checkEmail(req.body.email, users)) {
    res.send('EMAIL EXISTED !!!!');
  } else {
    users[idNum] = { id: idNum, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
    req.session.user_id = idNum;
    res.redirect('/urls');
  }
  console.log(users);
});  //register new user

app.get('/login', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  for (let user in users) {
    if (req.body.email === users[user]["email"]) {
      if (bcrypt.compareSync(req.body.password, users[user]["password"]) === true) {
        req.session.user_id = users[user]["id"];
        res.redirect('/urls');
        return;
      } else {
        res.status(403).send('wrong password or email');
        return;
      }
    }
  }

  res.status(403).send('email not found');
}); //check the login user

app.listen(PORT, () => {
  console.log(`THE SERVER IS RUNNING AT ${PORT}`);
});




