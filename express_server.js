const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 3000;    //defaul port 3000
const crypto = require('crypto');

function generateRandomString() {
  var id = crypto.randomBytes(3).toString('hex');
  return id;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// app.get('/', (req, res) => {
//   let templateVars = {greeting: `hello World`};
//   res.render('hello.ejs', templateVars);
// });

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// })

app.get('/urls/new', (req, res) => {
  res.render('urls_new.ejs')
})

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render('urls_show.ejs', templateVars);
})

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index.ejs', templateVars);
})

app.listen(PORT, () => {
  console.log(`THE SERVER IS RUNNING AT ${PORT}`);
});



