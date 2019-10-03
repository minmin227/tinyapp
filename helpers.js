
//START: HELPER FUNCTION
const checkEmail = function(input, users) {
  for (let user in users) {
    if (input === users[user]["email"]) {
      return true;
    }
  }
}; //CHECK exit email

function urlforUser(cookieID, urlDatabase) {
  let urlUser = {};
  for (url in urlDatabase) {
    if (urlDatabase[url].id === cookieID) {
      urlUser[url] = urlDatabase[url];
    }
  }
  return urlUser;
} //CHECK urls user currently has


function generateRandomString(l) {
  let str = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  let code = '';
  for (let i = 0; i < l; i++) {
    code += str.charAt(Math.floor(Math.random() * str.length));
  }
  return code;
} //CREATE new short url
//END: HELPER FUNCTION

module.exports = { checkEmail , urlforUser, generateRandomString };
