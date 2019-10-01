const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 5000;   
app.set('view engine', 'ejs');

function generateRandomString() {
  let str = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += str.charAt(Math.floor(Math.random() * str.length));
  }
  return code;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/urls/new', (req, res) => {
  res.render('urls_new')
})

app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  let shortURL =  generateRandomString();
  if((req.body.longURL).includes('http://')) {
    urlDatabase[shortURL] = req.body.longURL;
  } else {
    urlDatabase[shortURL] = 'http://' + req.body.longURL;
  }
  res.redirect(`/urls/${shortURL}`);    
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
})

app.get('/u/:shortURL', (req, res) => {
  let templateVars = urlDatabase[req.params.shortURL];
  res.redirect(templateVars);
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newlongURL;
  res.redirect('/urls');
}) 


app.listen(PORT, () => {
  console.log(`THE SERVER IS RUNNING AT ${PORT}`);
});




// app.get('/', (req, res) => {
//   let templateVars = {greeting: `hello World`};
//   res.render('hello.ejs', templateVars);
// });

