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
    if (data.user.role != 'admin') {
      alert('Please login admin account');
      window.open('/login.html', '_self');
    }
  })
  .catch(function (error) {
    console.error(error);
  });
fetch('/auth/trainsinfo')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var trainInfoContainer = document.getElementById('train-info');
    if (data.status === 'success') {
      for (var i = 0; i < data.trains.length; i++) {
        var train = data.trains[i];
        var state = '';
        var cardHtml;
        if (!train.enabled) {
          state = 'No Service Provided';
          cardHtml = `
          <div class="card col">
            <img src="${train.image}" class="card-img-top" alt="${train.destination}" style="width: 300px; height: 200px">
            <div class="card-body">
              <h5 class="card-title"><p class="fw-bold">_id: ${train._id}</p></h5>
              <h5 class="card-text"><p class="fw-bold">destination: ${train.destination}</p></h5>
              <p class="card-text fw-bold">prcie: ${train.price}</p>
              <p class="card-text fw-bold">enabled:  ${train.enabled}</p>
            </div>
          </div>
        `;
          trainInfoContainer.insertAdjacentHTML('beforeend', cardHtml);
        } else {
          state = 'Serving';
          cardHtml = `
          <div class="card col">
            <img src="${train.image}" class="card-img-top" alt="${train.destination}" style="width: 300px; height: 200px">
            <div class="card-body">
              <h5 class="card-title"><p class="fw-bold">_id: ${train._id}</p></h5>
              <h5 class="card-text"><p class="fw-bold">destination: ${train.destination}</p></h5>
              <p class="card-text fw-bold">prcie: ${train.price}</p>
              <p class="card-text fw-bold">enabled:  ${train.enabled}</p>
            </div>
          </div>
        `;
          trainInfoContainer.insertAdjacentHTML('beforeend', cardHtml);
        }
      }
    } else {
      var errorHtml = `
        <div class="alert alert-danger" role="alert">
          Failed to fetch train info. Please try again later.
        </div>
      `;
      trainInfoContainer.insertAdjacentHTML('beforeend', errorHtml);
      trainInfoContainer.classList.remove('row-cols-1', 'row-cols-sm-2', 'row-cols-md-4');
    }
  })
  .catch(function (error) {
    console.error(error);
  });

document.getElementById('edit').addEventListener('click', function () {
  document.getElementById('editor').style.display = 'block';
});

document.getElementById('close').addEventListener('click', function () {
  document.getElementById('editor').style.display = 'none';
});

document.getElementById('update').addEventListener('click', function () {
  var trainid = document.getElementById('trainid').value;
  var destination = document.getElementById('destination').value;
  var image = document.getElementById('image').value;
  var enable = document.getElementById('enabled').value;
  var price = document.getElementById('price').value;
  var enabled;
  if (enable == 'false') {
    enabled = false;
  } else {
    enabled = true;
  }
  if (image == '') {
    image = 'https://www.nationalgeographic.com/content/dam/expeditions/landing-pages/Rail/hero-rail-asia.jpg';
  }
  var formData = new FormData();
  formData.append('trainid', trainid);
  formData.append('image', image);
  formData.append('destination', destination);
  formData.append('price', price);
  formData.append('enabled', enabled);

  fetch('/auth/upadatetrain', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        alert(`Update Successfully!`);
        window.location.href = '/admintrains.html';
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

document.getElementById('delete').addEventListener('click', function () {
  var trainid = document.getElementById('trainid').value;
  var destination = document.getElementById('destination').value;
  var image = document.getElementById('image').value;
  var enable = document.getElementById('enabled').value;
  var price = document.getElementById('price').value;
  var enabled;
  if (enable == 'false') {
    enabled = false;
  } else {
    enabled = true;
  }
  if (image == '') {
    image = 'https://www.nationalgeographic.com/content/dam/expeditions/landing-pages/Rail/hero-rail-asia.jpg';
  }
  var formData = new FormData();
  formData.append('trainid', trainid);
  formData.append('image', image);
  formData.append('destination', destination);
  formData.append('price', price);
  formData.append('enabled', enabled);

  fetch('/auth/deletetrain', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        alert(`delete Successfully!`);
        window.location.href = '/admintrains.html';
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

document.getElementById('searchdestination').addEventListener('click', function () {
  var destination = document.getElementById('destination').value;

  var formData = new FormData();
  formData.append('destination', destination);

  fetch('/auth/searchtrain', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        document.getElementById('trainid').value = data.train._id;
        document.getElementById('destination').value = data.train.destination;
        document.getElementById('image').value = data.train.image;
        document.getElementById('price').value = data.train.price;
        var enable;
        if (!data.train.enabled) {
          enable = 'false';
        } else {
          enable = 'true';
        }
        document.getElementById('enabled').value = enable;
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

document.getElementById('remove').addEventListener('click', function () {
  var trainid = document.getElementById('trainid').value;
  var destination = document.getElementById('destination').value;
  var image = document.getElementById('image').value;
  var enable = document.getElementById('enabled').value;
  var price = document.getElementById('price').value;
  var enabled;
  if (enable == 'false') {
    enabled = false;
  } else {
    enabled = true;
  }
  if (image == '') {
    image = 'https://www.nationalgeographic.com/content/dam/expeditions/landing-pages/Rail/hero-rail-asia.jpg';
  }
  var formData = new FormData();
  formData.append('trainid', trainid);
  formData.append('image', image);
  formData.append('destination', destination);
  formData.append('price', price);
  formData.append('enabled', enabled);

  fetch('/auth/deletetraindisabled', {
    method: 'POST',
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status == 'success') {
        alert(`delete Successfully!`);
        window.location.href = '/admintrains.html';
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
