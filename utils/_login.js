/**
 * Login to the Twoday blogger platform
 * ====================================
 * 
 */
const cheerio = require('cheerio');
const request = require('request-promise-native');

//request.debug = true; // uncomment to activate debugging
require('dotenv-safe').load();

// set some defaults
const req = request.defaults({
  followAllRedirects: true,
  jar: true,
  simple: false,
  rejectUnauthorized: false,
  resolveWithFullResponse: true
});

const loginUrl = 'https://www.twoday.net/members/login';

/**
 * Returns a GETs secretKey to be used in a subsequent POST
 */
const getSecretKey = (body, response, resolveWithFullResponse) => {
  let $ = cheerio.load(body);
  return $('[name="secretKey"]').val();
};

/**
 * Login to Twoday to establish auth cookie
 * @param void
 * @returns Promise
 */
const loginTwoday = () => {
  return req.get({
    url: loginUrl,
    transform: getSecretKey
  })
  .then( (secretKey) => {
    return req.post({
      url: loginUrl,
      form: {
        'secretKey': secretKey,
        'popup': '',
        'step': '',
        'isuser': 1,
        'name': process.env.USER,
        'password': process.env.PASSWORD,
        'remember': 1,
        'modSoruaAuthServerAuthUri': 'http://www.sorua.net/typekey',
        'login': 'Anmelden'
      }
    });
  })
  .catch(function (err) {
    console.log('Login failed with error:', err);
  });
};

module.exports = { req, getSecretKey, loginTwoday };