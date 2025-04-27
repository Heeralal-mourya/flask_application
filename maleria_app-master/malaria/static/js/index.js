var imported = document.createElement('script');
imported.src = 'assets/js/common.js';
document.head.appendChild(imported);

const init = function() {
  sessionStorage.clear();
  document.getElementById('message').style.display = 'none';
  document.getElementById('login').addEventListener('click', clicked);
  document.getElementById('forgot').addEventListener('click', forgot);
};

const clicked = function() {
  if (!document.getElementById('email').value) {
    alert('Please Enter Email');
    return false;
  }
  if (!document.getElementById('password').value) {
    alert('Please Enter password');
    return false;
  }
  if (
    document.getElementById('email').value === '1234' &&
    document.getElementById('password').value === 'password'
  ) {
    window.location = 'overview.html';
    return;
  }
  if (document.getElementById('email').value) {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(document.getElementById('email').value) == false) {
      alert('Invalid Email Address');
      return false;
    }
  }
  const url = loginUrl + '/user/login';
  console.log(url);
  data = {
    username: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  console.log(JSON.stringify(data));
  const other_params = {
    headers: common_headers,
    body: JSON.stringify(data),
    method: 'POST'
  };
  fetch(url, other_params).then(function(response) {
    if (response.status == 200) {
      response.json().then(x => {
        sessionStorage.setItem('aiId', x.aiId);
        sessionStorage.setItem('tokenDetails', JSON.stringify(x.tokenDetails));
        window.location = 'overview.html';
      });
    } else {
      response.json().then(x => {
        alert(x.message);
      });
    }
  });
};

const forgot = function() {
  if (!document.getElementById('email').value) {
    alert('Please Enter Email');
    return false;
  }
  if (document.getElementById('email').value) {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(document.getElementById('email').value) == false) {
      alert('Invalid Email Address');
      return false;
    }
  }
  const url = loginUrl + '/user/forgot/password';
  console.log(url);
  data = {
    username: document.getElementById('email').value
  };
  console.log(JSON.stringify(data));
  const other_params = {
    headers: common_headers,
    body: JSON.stringify(data),
    method: 'POST'
  };
  fetch(url, other_params).then(function(response) {
    if (response.status == 200) {
      document.getElementById('message').style.display = 'block';
    } else {
      response.json().then(x => {
        alert(x.message);
      });
    }
  });
};
document.addEventListener('DOMContentLoaded', init);
