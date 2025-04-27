var useLocalPort = false; // Enable, true to test from local backend services

if (location.hostname.includes('127')) {
  if (useLocalPort) {
    var loginUrl = 'http://10.14.30.72:9000';
  } else {
    var loginUrl = 'http://oil&gas';
  }
} else {
  var loginUrl = location.protocol + '//' + location.hostname;
}
var token = JSON.parse(sessionStorage.getItem('tokenDetails'));
var common_headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Custom-Authorization': 'Bearer noauth'
};

if (token) {
  if (token.access_token) {
    common_headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + token.access_token
    };
  }
} else {
  common_headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Custom-Authorization': 'Bearer noauth'
  };
}

function validateEmail(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (
    (charCode >= 64 && charCode < 91) ||
    (charCode > 96 && charCode < 123) ||
    charCode == 46 ||
    (charCode >= 48 && charCode <= 57)
  ) {
    return true;
  }
  return false;
}
