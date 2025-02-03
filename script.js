const API_URL = "https://ghibliapi.vercel.app/films/";

// DOM references
const moviesContainerEl = document.getElementById("movies-container");
const myMoviesContainerEl = document.getElementById("my-movies-container");
const clearBtnEl = document.getElementById("clear-list-btn");

// Empty array for "my-movies-container", if not already stored in Local Storage
let myMovies = JSON.parse(localStorage.getItem("myMovies")) || [];

// FETCH API
// Fetch data from API, if not already stored in Local Storage
const fetchMovies = async () => {
    if (!localStorage.getItem("allMovies")) {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status code: ${response.status}`);
            }
            const movies = await response.json();

            // Add "rating" and "review" to data objects
            movies.forEach(movie => {
                movie.rating = "";
                movie.review = "";
            });

            // Render data from API
            renderMovies(movies);

            // Save data from API to Local Storage
            localStorage.setItem("allMovies", JSON.stringify(movies));
        }
        catch (error) {
            console.error(error);
        }
    } else {
        // Render data from Local Storage
        renderMovies(JSON.parse(localStorage.getItem("allMovies")));
    }
};

fetchMovies();

// RENDER FUNCTIONALITY
// Function to render API data to "movies-container"
function renderMovies(movies) {
    movies.forEach(movie => {
        // Create an article with an image
        const movieContainerEl = document.createElement("article");
        const movieImgEl = document.createElement("img");
        movieImgEl.src = movie.image;
        movieImgEl.alt = `${movie.title} cover`;
        movieContainerEl.appendChild(movieImgEl);

        // Create a title
        const movieTitleEl = document.createElement("h3");
        movieTitleEl.innerText = movie.title;
        movieContainerEl.appendChild(movieTitleEl);

        // Create "Add to list" button
        const addBtnEl = document.createElement("button");
        addBtnEl.setAttribute("id", `add-button-${movie.id}`);
        addBtnEl.innerText = "Add to list";
        // Event listener to add selected movie to "my-movies-container"
        addBtnEl.addEventListener("click", () => handleAddMyMovie(movie.id));
        movieContainerEl.appendChild(addBtnEl);

        // Append to HTML
        moviesContainerEl.appendChild(movieContainerEl);
    });
};

// Function to render selected movies to "my-movies-container"
const renderMyMovies = (movies) => {
    myMoviesContainerEl.innerHTML = ""; // Clear previous content

    movies.forEach(movie => {
        // Create an article with an image
        const movieContainerEl = document.createElement("article");
        const movieImgEl = document.createElement("img");
        movieImgEl.src = movie.image;
        movieImgEl.alt = `${movie.title} cover`;
        movieContainerEl.appendChild(movieImgEl);

        // Create wrapper for text
        const movieWrapperEl = document.createElement("div");
        movieContainerEl.appendChild(movieWrapperEl);

        // Create a title
        const movieTitleEl = document.createElement("h3");
        movieTitleEl.innerText = movie.title;
        movieWrapperEl.appendChild(movieTitleEl);

        // Create element for rating
        const movieRatingEl = document.createElement("p");
        movieRatingEl.innerText = `Rating: ${movie.rating || "Not rated"}`;
        movieWrapperEl.appendChild(movieRatingEl);

        // Create element for review
        const movieReviewEl = document.createElement("p");
        movieReviewEl.innerText = `Review: ${movie.review || "No review yet"}`;
        movieWrapperEl.appendChild(movieReviewEl);

        // Create form for user input
        const movieFormEl = document.createElement("form");
        movieFormEl.setAttribute("id", `movie-form-${movie.id}`);
        movieFormEl.innerHTML = `
            <fieldset>
                <legend>My review</legend>

                <label for="rating-${movie.id}">My rating
                    <select id="rating-${movie.id}">
                        <option value="&#9734;">&#9734;</option>
                        <option value="&#9734;&#9734;">&#9734;&#9734;</option>
                        <option value="&#9734;&#9734;&#9734;">&#9734;&#9734;&#9734;</option>
                        <option value="&#9734;&#9734;&#9734;&#9734;">&#9734;&#9734;&#9734;&#9734;</option>
                        <option value="&#9734;&#9734;&#9734;&#9734;&#9734;">&#9734;&#9734;&#9734;&#9734;&#9734;</option>
                    </select>
                </label>

                <label for="review-${movie.id}">My review
                    <textarea id="review-${movie.id}" placeholder="Write your review..." rows="5"></textarea>
                </label>

                <button type="submit">Add review</button>
            </fieldset>
        `;
        // Event listener to handle user input from form
        movieFormEl.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent page from reloading
            handleMovieForm(movie.id, movieRatingEl, movieReviewEl);
        });
        movieContainerEl.appendChild(movieFormEl);

        // Create "Remove from list" button
        const removeBtnEl = document.createElement("button");
        removeBtnEl.setAttribute("id", `remove-button-${movie.id}`);
        removeBtnEl.innerText = "Remove from list";
        // Event listener to remove selected movie from "my-movies-container"
        removeBtnEl.addEventListener("click", () => handleRemoveMyMovie(movie.id));
        movieContainerEl.appendChild(removeBtnEl);

        // Append to HTML
        myMoviesContainerEl.appendChild(movieContainerEl);
    });
};

// FORM FUNCTIONALITY
const handleMovieForm = (movieId, movieRatingEl, movieReviewEl) => {
    // Collect form
    const formEl = document.getElementById(`movie-form-${movieId}`);

    // Collect rating and review from form
    const myRating = document.getElementById(`rating-${movieId}`).value;
    const myReview = document.getElementById(`review-${movieId}`).value.trim();

    // Find selected movie in "myMovies" array
    const movieIndex = myMovies.findIndex((movie) => movie.id === movieId);

    if (movieIndex !== -1) {
        // Update movie rating and review
        myMovies[movieIndex].rating = myRating;
        myMovies[movieIndex].review = myReview;

        // Update UI
        movieRatingEl.innerText = `Rating: ${myRating}`;
        movieReviewEl.innerText = `Review: ${myReview || "No review yet"}`;

        // Update list in Local Storage with user input
        localStorage.setItem("myMovies", JSON.stringify(myMovies));
    }

    // Reset form
    formEl.reset();
};

// BUTTONS FUNCTIONALITY
// Button to add selected movie to "my-movies-container"
const handleAddMyMovie = (movieId) => {
    // Find selected movie in Local Storage
    const allMovies = JSON.parse(localStorage.getItem("allMovies")) || [];
    const selectedMovie = allMovies.find((movie) => movie.id === movieId);

    if (selectedMovie && !myMovies.some((movie) => movie.id === selectedMovie.id)) {
        // Add selected movie to "myMovies" array
        myMovies.push(selectedMovie);

        // Render updated list in "my-movies-container"
        renderMyMovies(myMovies);

        // Save updated list to Local Storage
        localStorage.setItem("myMovies", JSON.stringify(myMovies));
    }
};

// Button to remove selected movie from "my-movies-container"
const handleRemoveMyMovie = (movieId) => {
    // Remove selected movie from "myMovies" array
    myMovies = myMovies.filter((movie) => movie.id !== movieId);

    // Render updated list in "my-movies-container"
    renderMyMovies(myMovies);

    if (myMovies.length === 0) {
        // If array is empty, remove list in Local Storage
        localStorage.removeItem("myMovies");
    } else {
        // Else, update list in Local Storage
        localStorage.setItem("myMovies", JSON.stringify(myMovies));
    }
};

// Button to remove all movies from "my-movies-container"
clearBtnEl.addEventListener("click", () => {
    // Clear "myMovies" array
    myMovies = [];

    // Render updated list in "my-movies-container"
    renderMyMovies(myMovies);

    // Remove list in Local Storage
    localStorage.removeItem("myMovies");
});

// WINDOW RELOAD
// Render "my-movies-container" from Local Storage after window reload
window.addEventListener("load", () => {
    renderMyMovies(myMovies);
});