/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
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
    if (data.user.role != 'admin') {
      alert('Please login admin account');
      window.open('/login.html', '_self');
    }
  })
  .catch(function (error) {
    console.error(error);
  });

document.getElementById('cancel').addEventListener('click', function () {
  document.getElementById('username').value = '';
  document.getElementById('image').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('password').value = '';
});

document.getElementById('confirm').addEventListener('click', function () {
  var username = document.getElementById('username').value;
  var image = document.getElementById('image').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var password = document.getElementById('password').value;
  var role = 'user';
  if (image == '') {
    image = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  }
  var formData = new FormData();
  formData.append('username', username);
  formData.append('image', image);
  formData.append('password', password);
  formData.append('email', email);
  formData.append('phone', phone);

  fetch('/auth/adminchangeinfo', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        alert(`Edit ${data.user.username} Successfully!`);
        window.location.href = '/adminaccount.html';
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

document.getElementById('searchusername').addEventListener('click', function () {
  var username = document.getElementById('username').value;

  var formData = new FormData();
  formData.append('username', username);

  fetch('/auth/searchusername', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        document.getElementById('username').value = data.user.username;
        document.getElementById('image').value = data.user.image;
        document.getElementById('email').value = data.user.email;
        document.getElementById('phone').value = data.user.phone;
        document.getElementById('password').value = data.user.password;
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

document.getElementById('searchemail').addEventListener('click', function () {
  var email = document.getElementById('email').value;

  var formData = new FormData();
  formData.append('email', email);

  fetch('/auth/searchemail', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        document.getElementById('username').value = data.user.username;
        document.getElementById('image').value = data.user.image;
        document.getElementById('email').value = data.user.email;
        document.getElementById('phone').value = data.user.phone;
        document.getElementById('password').value = data.user.password;
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

document.getElementById('searchphone').addEventListener('click', function () {
  var phone = document.getElementById('phone').value;

  var formData = new FormData();
  formData.append('phone', phone);

  fetch('/auth/searchphone', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        document.getElementById('username').value = data.user.username;
        document.getElementById('image').value = data.user.image;
        document.getElementById('email').value = data.user.email;
        document.getElementById('phone').value = data.user.phone;
        document.getElementById('password').value = data.user.password;
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
