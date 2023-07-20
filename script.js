document
  .getElementById("movieForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    // Get the user's input from the form
    const movieKeyword = document.getElementById("movieKeyword").value;

    // Make the API call to search movies
    fetch(
      `http://www.omdbapi.com/?apikey=7b474cb7&s=${encodeURIComponent(
        movieKeyword
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Check if the API returned a valid response
        if (data.Response === "True") {
          // Clear previous movie info before displaying new search results
          document.getElementById("movieInfo").innerHTML = "";

          // Display each movie result in the movieInfo div
          data.Search.forEach((movie, index) => {
            // Make a new API call using the movie's IMDb ID to get detailed movie information
            fetch(
              `http://www.omdbapi.com/?apikey=7b474cb7&i=${encodeURIComponent(
                movie.imdbID
              )}`
            )
              .then((response) => response.json())
              .then((detailedData) => {
                // Handle the response for the detailed movie data
                const plot = detailedData.Plot;
                const modalId = `exampleModal-${index}`;

                // Generate the modal content for each movie with its plot
                const movieInfo = `
                  <div class="card mb-3">
                    <div class="row g-0">
                      <div class="col-md-4">
                        <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title} Poster">
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 class="card-title">${movie.Title} (${movie.Year})</h5>

                          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">
                            Read more
                          </button>

                          <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h1 class="modal-title fs-5" id="exampleModalLabel">${movie.Title}</h1>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                  <p>${plot}</p>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                document.getElementById("movieInfo").innerHTML += movieInfo;
              })

              .catch((error) => {
                // Handle any errors that occurred during the fetch calls for detailed data
                console.error("Error fetching detailed data:", error);
              });
          });
        } else {
          // Display an error message if no movies were found
          document.getElementById(
            "movieInfo"
          ).innerHTML = `<p>No movies found for the keyword: ${movieKeyword}</p>`;
        }
      })
      .catch((error) => {
        // Display an error message if there was an issue with the API call
        document.getElementById(
          "movieInfo"
        ).innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        console.error(error);
      });
  });
