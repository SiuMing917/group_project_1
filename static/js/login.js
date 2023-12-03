/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
document.getElementById('ForgetPassword').style.display = 'none';
document.getElementById('yourpassword').style.display = 'none';
const rememberUserIdCheckbox = document.getElementById('rememberUserId');
rememberUserIdCheckbox.addEventListener('change', function () {
  if (rememberUserIdCheckbox.checked) {
    localStorage.setItem('rememberUserId', 'true');
  } else {
    localStorage.removeItem('rememberUserId');
  }
});

document.getElementById('login').addEventListener('click', function () {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  // Check user inputs both username and password
  if (username == '' || password == '') {
    alert('Username and password cannot be empty');
  } else {
    var formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('/auth/login', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.status == 'success') {
          if (rememberUserIdCheckbox.checked) {
            localStorage.setItem('username', username);
          }
          alert('Logged in as `' + data.user.username + '` (' + data.user.role + ')');
          if (data.user.role == 'admin') {
            window.location.href = '/admin.html';
          } else {
            window.location.href = '/account.html';
          }
        } else if (data.status == 'failed') {
          alert(data.message);
        } else {
          alert('Unknown error');
        }
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
});

document.getElementById('register').addEventListener('click', function () {
  window.location.href = '/register.html';
});

document.getElementById('forget').addEventListener('click', function () {
  document.getElementById('ForgetPassword').style.display = 'block';
  document.getElementById('LoginForm').style.display = 'none';
});

document.getElementById('back').addEventListener('click', function () {
  document.getElementById('ForgetPassword').style.display = 'none';
  document.getElementById('LoginForm').style.display = 'block';
});

document.getElementById('getpass').addEventListener('click', function () {
  var username = document.getElementById('fusername').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  // Check user inputs both username and password
  if (username == '' || email == '' || phone == '') {
    alert('Username ,Email and Phone Number cannot be empty');
  } else {
    var formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);

    fetch('/auth/forgetpassword', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.status == 'success') {
          alert('Password retrieval successful! The page will display your password.');
          document.getElementById('yourpassword').style.display = 'block';
          document.getElementById('fpassword').value = data.user.password;
        } else if (data.status == 'failed') {
          alert(data.message);
          document.getElementById('yourpassword').style.display = 'none';
        } else {
          alert('Unknown error');
        }
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
});
