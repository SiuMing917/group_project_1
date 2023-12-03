/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
document.getElementById('register').addEventListener('click', function () {
  var image = document.getElementById('image').value;
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var password = document.getElementById('password').value;
  var repeatpassword = document.getElementById('repeat-password').value;
  var role = 'user';
  if (image == '') {
    image = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  }
  // Check user inputs both username and password
  if (username == '' || password == '' || phone == '') {
    alert('Username, Password and Phone Number cannot be empty');
  } else if (repeatpassword != password) {
    alert('Password mismatch!');
  } else {
    var formData = new FormData();
    formData.append('image', image);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('role', role);

    fetch('/auth/register', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.status == 'success') {
          alert(`Welcome, ${data.user.username}!\nYou can login with your account now!`);
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
  }
});
