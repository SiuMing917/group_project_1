/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
document.getElementById('editor').style.display = 'none';
fetch('/auth/me')
  .then(function (response) {
    if (!response.ok) {
      alert('Please login');
      window.open('/login.html', '_self');
    } else {
      return response.json();
    }
  })
  .then(function (data) {
    var imageElement = document.getElementById('imaging');
    var newImageUrl = data.user.image;
    var newImageObject = new Image();
    newImageObject.src = newImageUrl;

    newImageObject.onload = function () {
      imageElement.src = this.src;
    };

    var greetingElement = document.getElementById('greeting');
    greetingElement.innerText = 'Welcome Back! ' + data.user.username;
    document.getElementById('email').value = data.user.email;
    document.getElementById('phone').value = data.user.phone;
  })
  .catch(function (error) {
    console.error(error);
  });

document.getElementById('logout').addEventListener('click', function () {
  var confirmLogout = confirm('Confirm to logout?');
  if (confirmLogout) {
    logout();
  }
});

function logout() {
  fetch('/auth/logout', {
    method: 'POST',
  })
    .then(function (response) {
      window.location.href = '/login.html';
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.getElementById('edit').addEventListener('click', function () {
  document.getElementById('editor').style.display = 'block';
});

document.getElementById('cancel').addEventListener('click', function () {
  document.getElementById('editor').style.display = 'none';
});

document.getElementById('confirm').addEventListener('click', function () {
  var image = document.getElementById('image').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var password = document.getElementById('password').value;
  var repeatpassword = document.getElementById('repeat-password').value;
  var role = 'user';
  if (image == '') {
    image = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  }
  var formData = new FormData();
  formData.append('image', image);
  formData.append('password', password);
  formData.append('repeatpassword', repeatpassword);
  formData.append('email', email);
  formData.append('phone', phone);

  fetch('/auth/changeinfo', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        alert(
          `Edit Successfully! ${data.user.username},\nYou can need to login again.\nIf your password or repeat password is empty, the password will not be updated`
        );
        logout();
        window.location.href = '/login.html';
      } else if (data.status == 'failed') {
        alert(data.message);
      } else {
        alert('Unknown error');
      }
    })
    .catch(function (error) {
      console.error('Error:', error);
      alert(error.message);
    });
});

// Set the idle time in milliseconds
const idleTime = 10 * 60 * 1000; // 10 minutes

let logoutTimer;

// Function to reset the logout timer
function resetLogoutTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(logout, idleTime);
}

// Function to handle user activity
function handleUserActivity() {
  resetLogoutTimer();
  // Additional code to handle user activity
}

// Add event listeners to handle user activity
document.addEventListener('mousemove', handleUserActivity);
document.addEventListener('keydown', handleUserActivity);
// Call resetLogoutTimer when the page loads
resetLogoutTimer();
