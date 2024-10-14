init();

// function to be called when the page loads
function init() {
  //get the first film from the server
 
  //call function displayMovieList to display the list of movies in the DOM
  displayMovieList();
  // dislay first movie on loading
  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    //for each movie, enter its tittle in a new list item and display it in the DOM
    .then((movies) => {
      displayMovie(movies[0])
    });
}
// define function displayMovie()
function displayMovie(movie) {
  
  //display movie poster
  const movieImage = document.querySelector("#poster");
  movieImage.src = `${movie.poster}`;

  //display movie title
  const movieTitle = document.querySelector("#title");
  movieTitle.setAttribute("data-id", movie.id);
  movieTitle.innerText = movie.title;


  //display movie runtime
  const movieRunTime = document.querySelector("#runtime");
  movieRunTime.innerText = `${movie.runtime} minutes`;


  //display movie description
  const movieDescription = document.querySelector("#film-info");
  movieDescription.innerText = movie.description;


  //display movie show time
  const movieShowTime = document.querySelector("#showtime");
  movieShowTime.innerText = movie.showtime;
  //display movie tickets sold
  const movieTicketsSold = document.querySelector("#ticket-num");
  const availableTickets = (movie.capacity - movie.tickets_sold)
  movieTicketsSold.innerText = `${availableTickets} remaining tickets`;  
  //call buyMovieTicket function  
    
   buyMovieTicket(movie.id);
}
//define function dispayMovieList which gets the list of movie titles from the server and displays them in the DOM once called
function displayMovieList(movie) {
  //fetch movie titles from the server


  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    //for each movie, enter its tittle in a new list item and display it in the DOM
    .then((movies) => {
      movies.forEach(function (movie) {
        const movieListUl = document.querySelector("#films");
        const movieListLi = document.createElement("li"); // new li element for each movie title populating each with a movie title
        movieListLi.className = "film item";
        movieListLi.id = `${movie.id}`;
        movieListLi.innerHTML = `${movie.title}`;   

        //create a delete button for every movie title
        const deleteBtn = document.createElement('i');
        deleteBtn.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`
        //add event listener to delete button that calls deleteMovie function to delete movie from the server and remove it from the DOM
        deleteBtn.addEventListener('click', () => {
          deleteMovie(movie.id);
        })
        movieListLi.appendChild(deleteBtn);
        movieListUl.appendChild(movieListLi); 
       
    // call displayAnyMovieInMovieList function to display any movie in the movie list upon clicking it from the movie list
    displayAnyMovieInMovieList()
    const availableTickets = (movie.capacity - movie.tickets_sold)
    const buyTicketButton = document.querySelector('#buy-ticket');

    //assign buy ticket button text content based on available tickets and sold out status to sold out movies
    if(availableTickets > 0){
      buyTicketButton.textContent = "Buy Ticket";
    
    }
    else{
      buyTicketButton.textContent = "Sold Out";
      //iterate through movie titles and assign dierent class to sold out movies
      const movieTitles = document.querySelectorAll('.film.item');
      movieTitles.forEach(function(movieTitle){
        if(movieTitle.id === movie.id){
          movieTitle.className = 'sold-out'
        }
      })
    }
      

    
      });
    });
    
}


//describe function buyMovieTicket
function buyMovieTicket(movieId) {

  
 
    const buyTicketButton = document.querySelector('#buy-ticket');

    // Define the event handler function outside
   
  
    // Remove existing event listener
    buyTicketButton.removeEventListener('click', handleBuyTicket);
    
    // Add the new event listener
    buyTicketButton.addEventListener('click', handleBuyTicket);         
   
}
  
// Define the event handler function, a callback for buyMovieTicket button's click event
function handleBuyTicket() {
  // get the number of tickets from the DOM
  const tickets =  document.querySelector('#ticket-num').innerText.split(' ')[0];

  //executes if therenly one ticket is remaining. 
if(parseInt(tickets) === 1){
    //fetch tickets sold from the server
  const buyTicketButton = document.querySelector('#buy-ticket');   
  buyTicketButton.textContent = "Buy Ticket";
  const movieId = document.querySelector('#title').getAttribute('data-id');
  fetch(`http://localhost:3000/films/${movieId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
   },
  })
 .then(response => response.json())
 //update the number of tickets sold on the server
 .then(movie => {
   const updatedTicketsSold = movie.tickets_sold + 1;

   return fetch(`http://localhost:3000/films/${movieId}`, {
     method: 'PATCH',
     headers: {
       'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold })
   });
 })
 .then(response => response.json())
 //update the number of tickets sold in the DOM
 .then(updatedMovie => {
   const remainingTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
   document.querySelector('#ticket-num').innerText = `${remainingTickets} remaining tickets`;
   const buyTicketButton = document.querySelector('#buy-ticket');  
   // update the text of the button to sold out, given that this block executes when there's only one ticket left 
     buyTicketButton.textContent = "Sold Out";
     // update the class of the movie title to sold out highlight it as sold out in the movie list
     const movieTitles = document.querySelectorAll('.film.item');
      movieTitles.forEach(function(movieTitle){
        if(movieTitle.id === updatedMovie.id){
          movieTitle.className = 'sold-out'
        }
      })
      
 })
 }  
  // executes if there's more than one ticket left
else if (tickets > 0) {
  //fetches tickets sold from the server
  const buyTicketButton = document.querySelector('#buy-ticket');   
    buyTicketButton.textContent = "Buy Ticket";
    const movieId = document.querySelector('#title').getAttribute('data-id');
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
     },
    })
   .then(response => response.json())
   .then(movie => {
     const updatedTicketsSold = movie.tickets_sold + 1;
     //updates the number of tickets sold on the server
     return fetch(`http://localhost:3000/films/${movieId}`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickets_sold: updatedTicketsSold })
     });
   })
   .then(response => response.json())
   //updates the number of tickets sold in the DOM
   .then(updatedMovie => {
     const remainingTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
     document.querySelector('#ticket-num').innerText = `${remainingTickets} remaining tickets`;


     //sends the ticket sold to a new server endpoint, /tickets
     fetch('http://localhost:3000/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        film_id: updatedMovie.id,
        number_of_tickets: 1
      })
    })
    
   })

  
  }
  //executes if there are no more tickets left
  else {
    // fetch tickets sold from the server
    const movieId = document.querySelector('#title').getAttribute('data-id');
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
     },
    })
   .then(response => response.json())
   //updates text of the button to sold out
   .then(movie =>{
    const buyTicketButton = document.querySelector('#buy-ticket');   
     buyTicketButton.textContent = "Sold Out";
     
     
     
   })
   
  }
  
}

//describe function to display a movie in the movie list 
function displayAnyMovieInMovieList() {
   //get NodeList of all movies in the movie list
    const movieList = document.querySelectorAll('.film.item')
    
    //for each, add event listener to each movie to display the movie in the DOM once it is clicked
    movieList.forEach(function(film){
    
        film.addEventListener('click', selectMovieFromList)
        
    })
    //
    
    
    
}

function selectMovieFromList(event){
  //fetch data about the movie from server
  const movieId = event.target.id;
  fetch(`http://localhost:3000/films/${event.target.id}`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
  })
  .then(response => response.json())
  //display the movie in the DOM
  .then(movie => {
      displayMovie(movie)
  })
}

function deleteMovie(movieId) {
  // Delete the movie from the server
  fetch(`http://localhost:3000/films/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    
      // Remove the movie from the DOM
      const movieItem = document.getElementById(movieId);
      movieItem.remove();
   
  })
  
}
