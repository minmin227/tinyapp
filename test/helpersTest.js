const { assert } = require('chai');
const { checkEmail } = require('../helpers');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkEmail', function() {
  it('should be TRUE if found', function() {
    const user = checkEmail("user@example.com", users)
    const expectedOutput = true;
    assert.equal(user, expectedOutput)
    // Write your assert statement here
  });
});

describe('checkEmail', function() {
  it('should be UNDEFINED if not found ', function() {
    let user = checkEmail("user@e", users);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
    // Write your assert statement here
  });
});

