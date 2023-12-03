/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
fetch('/auth/allhistory')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var historyInfoContainer = document.getElementById('ticket-info');
    if (data.status === 'success') {
      for (var i = 0; i < data.tickets.length; i++) {
        var ticket = data.tickets[i];
        var state = '';
        var cardHtml;
        if (!ticket.enabled) {
          state = 'This Ticket already Used or Expired';
          cardHtml = `
          <div class="card col">
            <div class="card-body">
            <h5 class="card-title text-bg-info"><p class="fw-bold"><strong>Username: </strong>${ticket.username}</p></h5>
              <h5 class="card-title"><p class="fw-bold"><strong>Destination: </strong>${ticket.destination}</p></h5>
              <p class="card-text fw-bold"><strong>Carriage: </strong> ${ticket.carriage}</p>
              <p class="card-text fw-bold"><strong>Date: </strong> ${ticket.ticketDate}</p>
              <p class="card-text fw-bold"><strong>Time: </strong> ${ticket.ticketTime}:00</p>
              <p class="card-text fw-bold"><strong>Seat: </strong> ${ticket.seat}</p>
              <p class="card-text fw-bold"><strong>Price: </strong> ${ticket.price}</p>
              <p class="card-text text-bg-danger fw-bold">State:  ${state}</p>

            </div>
          </div>
        `;
          historyInfoContainer.insertAdjacentHTML('beforeend', cardHtml);
        } else {
          state = 'Please Use it within the Ticket Time';
          cardHtml = `
          <div class="card col">
            <div class="card-body">
            <h5 class="card-title text-bg-info"><p class="fw-bold"><strong>Username: </strong>${ticket.username}</p></h5>
              <h5 class="card-title"><p class="fw-bold"><strong>Destination: </strong>${ticket.destination}</p></h5>
              <p class="card-text fw-bold"><strong>Carriage: </strong> ${ticket.carriage}</p>
              <p class="card-text fw-bold"><strong>Date: </strong> ${ticket.ticketDate}</p>
              <p class="card-text fw-bold"><strong>Time: </strong> ${ticket.ticketTime}:00</p>
              <p class="card-text fw-bold"><strong>Seat: </strong> ${ticket.seat}</p>
              <p class="card-text fw-bold"><strong>Price: </strong> ${ticket.price}</p>
              <p class="card-text text-bg-success fw-bold">State:  ${state}</p>
            </div>
          </div>
        `;
          historyInfoContainer.insertAdjacentHTML('beforeend', cardHtml);
        }
      }
    } else {
      var errorHtml = `
        <div class="alert alert-danger" role="alert">
          Failed to fetch history info. Please try again later.
        </div>
      `;
      historyInfoContainer.insertAdjacentHTML('beforeend', errorHtml);
      historyInfoContainer.classList.remove('row-cols-1', 'row-cols-sm-2', 'row-cols-md-4');
    }
  })
  .catch(function (error) {
    console.error(error);
  });
