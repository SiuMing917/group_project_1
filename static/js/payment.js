/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
fetch('/auth/myorder')
  .then(function (response) {
    if (!response.ok) {
      alert('Please order');
      window.open('/ticketing.html', '_self');
    } else {
      return response.json();
    }
  })
  .then(function (data) {
    document.getElementById('destination').innerText = 'Destination: ' + data.order.destination;
    document.getElementById('carriage').innerText = 'Carriage: ' + data.order.carriage;
    document.getElementById('date').innerText = 'Departure Date: ' + data.order.ticketDate;
    document.getElementById('time').innerText = 'Departure Time: ' + data.order.ticketTime + ':00';
    document.getElementById('seat').innerText = 'Seat Number: ' + data.order.seat;
    document.getElementById('price').innerText = 'Ticket Price: ' + data.order.price;
    document.getElementById('pricetext').innerText = 'Price: ' + data.order.price;
  })
  .catch(function (error) {
    console.error(error);
  });

document.getElementById('pay').addEventListener('click', function () {
  var cardNumber = document.getElementById('card-number').value;
  var cardDate = document.getElementById('expiration-date').value;
  var cvv = document.getElementById('cvv').value;

  if (cvv == '' || cardNumber == '' || cardDate == '') {
    alert('Credit Card Information cannot be empty');
  } else if (!validateCreditCard(cardNumber, cvv, cardDate)) {
    alert(
      'Incorrenct Credit Card Format \nCard Number must be a number and has length between 13 and 19.\nCVV must be a number and has a length of 3.\nExpiration Date must be in the format MM/YY and a valid date'
    );
  } else {
    var formData = new FormData();
    formData.append('cardNumber', cardNumber);
    formData.append('cardDate', cardDate);
    formData.append('cvv', cvv);
    fetch('/auth/payment', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.status == 'success') {
          alert(`Payment Successful!`);
          window.location.href = '/electronicticket.html';
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

document.getElementById('cancel').addEventListener('click', function () {
  window.location.href = '/ticketing.html';
});

function validateCreditCard(cardNumber, cvv, expirationDate) {
  // Check if the card number is a number and has a length between 13 and 19
  if (!isNumber(cardNumber) || cardNumber.toString().length < 13 || cardNumber.toString().length > 19) {
    return false;
  }

  // Check if the cvv is a number and has a length of 3
  if (!isNumber(cvv) || cvv.toString().length !== 3) {
    return false;
  }

  // Check if the expiration date is in the format MM/YY and is a valid date
  const dateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
  if (!dateRegex.test(expirationDate)) {
    return false;
  }

  // Validate the year and month
  const today = new Date();
  const currentYear = today.getFullYear() % 100;
  const currentMonth = today.getMonth() + 1;
  const [inputMonth, inputYear] = expirationDate.split('/');

  if (
    parseInt(inputYear) < currentYear ||
    (parseInt(inputYear) == currentYear && parseInt(inputMonth) < currentMonth)
  ) {
    return false;
  }

  return true;
}

function isNumber(input) {
  return !isNaN(parseFloat(input)) && isFinite(input);
}
