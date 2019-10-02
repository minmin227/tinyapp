const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 5000;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs');

function generateRandomString(l) {
  let str = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  let code = '';
  for (let i = 0; i < l; i++) {
    code += str.charAt(Math.floor(Math.random() * str.length));
  }
  return code;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
}

const checkEmail = function (input) {
  for (let user in users) {
    if (input === users[user]["email"]) {
      return true;
    }
  }
}


app.get('/urls/new', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render('urls_new', templateVars);
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render('urls_index', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let code = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", code);
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  if ((req.body.longURL).includes('http://')) {
    urlDatabase[shortURL] = req.body.longURL;
  } else {
    urlDatabase[shortURL] = 'http://' + req.body.longURL;
  }
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls/:shortURL', (req, res) => {
  let newCode = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", newCode);
});

app.get('/u/:shortURL', (req, res) => {
  let link = urlDatabase[req.params.shortURL];
  res.redirect(link);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newlongURL;
  res.redirect('/urls');
});


app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]]};
  res.render('urls_register', templateVars);
})

app.post('/register', (req, res) => {
  let idNum = generateRandomString(4);
  if (!req.body.email || !req.body.password) {
    res.status(400).send('status code 400');
  } else if (checkEmail(req.body.email)) {
    res.send('EMAIL EXISTED !!!!')
  } else {
    users[idNum] = { id: idNum, email: req.body.email, password: req.body.password };
    res.cookie("user_id", idNum);
    res.redirect('/urls');
  }
  console.log(users);
})

app.get('/login', (req, res) => {
  res.render('urls_login')
})

app.post('/login', (req, res) => {
  for (let user in users) {
    if (req.body.email === users[user]["email"] && req.body.password === users[user]["password"]) {
      res.cookie('user_id', users[user]["id"]);
      return res.redirect('/urls');
    } else if (req.body.email !== users[user]["email"]) {
      return res.status(403).send('email not found')
    } else {
      res.status(403).send('wrong password or email');
    }
  }
})



app.listen(PORT, () => {
  console.log(`THE SERVER IS RUNNING AT ${PORT}`);
});




