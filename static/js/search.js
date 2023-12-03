/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
const destinationInput = document.getElementById('destination');
const carriageInput = document.getElementById('carriage');
const dateInput = document.getElementById('ticketDate');
const timeInput = document.getElementById('ticketTime');
document.getElementById('seatmap').style.display = 'none';
document.getElementById('selected-seat').style.display = 'none';
const seats = document.querySelectorAll('.seat');
const selectionText = document.getElementById('seat');

const priceInput = document.getElementById('price');
var trains_information = '';

fetch('/auth/trainsinfo')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if (data.status === 'success') {
      const trains = data.trains;
      trains_information = data.trains;
      trains.forEach(function (train) {
        if (train.enabled) {
          const option = document.createElement('option');
          option.value = train.destination;
          option.textContent = train.destination;
          destinationInput.appendChild(option);
        }
      });
    }
  });

destinationInput.addEventListener('change', function () {
  const destination = destinationInput.value;

  const train = trains_information.find(function (train) {
    return train.destination === destination;
  });

  if (train) {
    priceInput.value = train.price;
  } else {
    priceInput.value = '';
  }
  document.getElementById('seatmap').style.display = 'none';
});

seats.forEach((seat) => {
  seat.addEventListener('click', () => {
    if (seat.classList.contains('selected')) {
      alert(`This seat is already occupied`);
    }
  });
});

carriageInput.addEventListener('change', async () => {
  document.getElementById('seatmap').style.display = 'none';
});

dateInput.addEventListener('change', async () => {
  document.getElementById('seatmap').style.display = 'none';
});

timeInput.addEventListener('change', async () => {
  document.getElementById('seatmap').style.display = 'none';
});

document.getElementById('searchbtn').addEventListener('click', function () {
  var destination = document.getElementById('destination').value;
  var carriage = document.getElementById('carriage').value;
  var ticketDate = document.getElementById('ticketDate').value;
  var ticketTime = document.getElementById('ticketTime').value;
  var price = document.getElementById('price').value;

  if (destination == '' || carriage == '' || ticketDate == '' || ticketTime == '') {
    alert('Ticketing Information cannot be empty');
  } else {
    var formData = new FormData();
    formData.append('destination', destination);
    formData.append('carriage', carriage);
    formData.append('ticketDate', ticketDate);
    formData.append('ticketTime', ticketTime);
    formData.append('price', price);
    fetch('/auth/order', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.status == 'success') {
          document.getElementById('seatmap').style.display = 'block';
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

  fetch('/auth/seat')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var seats = document.querySelectorAll('.seat');
      seats.forEach((seat) => {
        seat.classList.remove('selected');
      });
      seats.forEach((seat) => {
        var matchingSeat = data.seat.find((s) => s.seat === seat.id);
        if (matchingSeat) {
          seat.classList.add('selected');
        }
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

fetch('/auth/seat')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var seats = document.querySelectorAll('.seat');
    seats.forEach((seat) => {
      seat.classList.remove('selected');
    });
    seats.forEach((seat) => {
      var matchingSeat = data.seat.find((s) => s.seat === seat.id);
      if (matchingSeat) {
        seat.classList.add('selected');
      }
    });
  })
  .catch(function (error) {
    console.error(error);
  });
