const destinationsList = document.querySelector('.destinations');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
  if(user){
    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}

// setup destinations
const setupDestinations = (data) => {

  if(data.length){
    let html = '';
    data.forEach(doc => {
      const destination = doc.data();

      const li = ` 
      <li class="travel">
        <h2 class="collapsible-header grey lighten-4">${destination.city}</h2>
        <div class="collapsible-body white">
          <h3>Weather conditions</h3>
          <div class="weather-details">
            <p>${destination.meteo}weather icon / image</p>
            <p>temperature</p>
          </div>
          <p>${destination.date}</p>
          <p><span>X</span> days before departure</p>
        </div>
      </li>
      `;
      html += li;
    })
    destinationsList.innerHTML = html;
  } else{
    destinationsList.innerHTML = '<h5>Login to start Travel List</h5>';
  }

  
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  const items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  const elems = document.querySelector('.sidenav');
  M.Sidenav.init(elems);

});


