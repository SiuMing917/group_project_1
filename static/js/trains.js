/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
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
              <h5 class="card-title"><p class="fw-bold">${train.destination}</p></h5>
              <p class="card-text fw-bold">Price: ${train.price}</p>
              <p class="card-text text-bg-danger fw-bold">State: ${state}</p>
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
              <h5 class="card-title"><p class="fw-bold">${train.destination}</p></h5>
              <p class="card-text fw-bold">Price: ${train.price}</p>
              <p class="card-text text-bg-success fw-bold">State: ${state}</p>
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
