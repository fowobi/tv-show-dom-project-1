//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }

// window.onload = setup;


function setup() {
  const showsEndpoint = "https://api.tvmaze.com/shows";
  const episodesEndpoint = "https://api.tvmaze.com/shows/82/episodes";

  fetch(showsEndpoint)
    .then((response) => response.json())
    .then((data) => {
      makeShowsListing(data);
      // addSearchFunctionality(data);
      addShowFiltering(data);
    })
    .catch((error) => console.log(error));

  fetch(episodesEndpoint)
    .then((response) => response.json())
    .then((data) => makePageForEpisodes(data))
    .catch((error) => console.log(error));
}

function makeShowsListing(shows) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const showsContainer = document.createElement("div");
  showsContainer.className = "shows-container";
  rootElem.appendChild(showsContainer);

  shows.forEach((show) => {
    const showElem = document.createElement("div");
    showElem.className = "show";
    showElem.addEventListener("click", () => {
      const episodesEndpoint = `https://api.tvmaze.com/shows/${show.id}/episodes`;
      fetch(episodesEndpoint)
        .then((response) => response.json())
        .then((data) => {
          makePageForEpisodes(data);
          const episodesContainer = rootElem.querySelector(
            ".episodes-container"
          );
          episodesContainer.style.display = "block";
        })
        .catch((error) => console.log(error));
    });

    const showName = document.createElement("h2");
    showName.className = "show-name";
    showName.textContent = show.name;
    showElem.appendChild(showName);

    const showImage = document.createElement("img");
    showImage.src = show.image.medium;
    showImage.alt = show.name;
    showElem.appendChild(showImage);

    const showSummary = document.createElement("summary");
    showSummary.className = "show-summary";
    showSummary.innerHTML = show.summary;
    showElem.appendChild(showSummary);

    const showGenres = document.createElement("p");
    showGenres.textContent = `Genres: ${show.genres.join(", ")}`;
    showElem.appendChild(showGenres);

    const showStatus = document.createElement("p");
    showStatus.textContent = `Status: ${show.status}`;
    showElem.appendChild(showStatus);

    const showRating = document.createElement("p");
    showRating.textContent = `Rating: ${show.rating.average || "N/A"}`;
    showElem.appendChild(showRating);

    const showRuntime = document.createElement("p");
    showRuntime.textContent = `Runtime: ${show.runtime} minutes`;
    showElem.appendChild(showRuntime);

    showsContainer.appendChild(showElem);
  });
}

function addShowFiltering(allShows) {
  const rootElem = document.getElementById("root");

  const filterContainer = document.createElement("div");
  filterContainer.className = "filter-container";
  rootElem.insertBefore(filterContainer, rootElem.firstChild);

  const filterInput = document.createElement("input");
  filterInput.className = "show-filter-input";
  filterInput.placeholder = "Enter a show name...";
  filterInput.addEventListener("input", () => {
    const filterValue = filterInput.value.toLowerCase().trim();
    const filteredShows = allShows.filter((show) => {
      const showName = show.name.toLowerCase();
      const showSummary = show.summary.toLowerCase();
      return (
        showName.includes(filterValue) || showSummary.includes(filterValue)
      );
    });
    makeFilteredShowsListing(filteredShows);
  });
  filterContainer.appendChild(filterInput);

  const filterCount = document.createElement("p");
  filterCount.className = "filter-count";
  filterContainer.appendChild(filterCount);

  const filteredShowsContainer = document.createElement("div");
  filteredShowsContainer.className = "filtered-shows-container";
  rootElem.appendChild(filteredShowsContainer);

  function makeFilteredShowsListing(filteredShows) {
    filteredShowsContainer.innerHTML = "";
    filterCount.textContent = `Found ${filteredShows.length} shows`;

    if (filteredShows.length === 0) {
      filterCount.style.display = "none";
      return;
    } else {
      filterCount.style.display = "block";
    }

    const rootElem = document.getElementById("root");

    // Remove existing dropdown container if it exists
    const existingDropdownContainer = document.querySelector(
      ".filtered-shows-dropdown-container"
    );
    if (existingDropdownContainer) {
      existingDropdownContainer.remove();
    }

    const filteredShowsDropdownContainer = document.createElement("div");
    filteredShowsDropdownContainer.className =
      "filtered-shows-dropdown-container";
    rootElem.insertBefore(filteredShowsDropdownContainer, rootElem.firstChild);

    const filteredShowsDropdown = document.createElement("select");
    filteredShowsDropdown.className = "filtered-shows-dropdown";
    filteredShowsDropdown.addEventListener("change", () => {
      const selectedShowId = parseInt(filteredShowsDropdown.value);
      const selectedShow = filteredShows.find(
        (show) => show.id === selectedShowId
      );
      if (selectedShow) {
        const episodesEndpoint = `https://api.tvmaze.com/shows/${selectedShow.id}/episodes`;
        fetch(episodesEndpoint)
          .then((response) => response.json())
          .then((data) => {
            makePageForEpisodes(data);
            const episodesContainer = rootElem.querySelector(
              ".episodes-container"
            );
            episodesContainer.style.display = "block";
          })
          .catch((error) => console.log(error));
      }
    });

    filteredShows.forEach((show) => {
      const showOption = document.createElement("option");
      showOption.value = show.id;
      showOption.textContent = show.name;
      filteredShowsDropdown.appendChild(showOption);
    });

    filteredShowsDropdownContainer.appendChild(filteredShowsDropdown);
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodesContainer = rootElem.querySelector(".episodes-container");
  if (!episodesContainer) {
    const episodesContainer = document.createElement("div");
    episodesContainer.className = "episodes-container";
    rootElem.appendChild(episodesContainer);
  } else {
    episodesContainer.innerHTML = "";
  }
}
// Rest of the code remains the same...

// This is the Season Code
function getEpisodeCode(episode) {
  const season = episode.season.toString().padStart(2, "0");
  const number = episode.number.toString().padStart(2, "0");
  const episodeId = `S${season}E${number}`;
  return episodeId;
}

// This is header-Displaying Number Code
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  addSelectFunctionality(episodeList);
  addSearchFunctionality(episodeList);
  const episodeCountElem = document.createElement("p");
  episodeCountElem.className = "episode-count";
  episodeCountElem.textContent = `Displaying ${episodeList.length} / ${episodeList.length} episodes`;
  rootElem.appendChild(episodeCountElem);

  // This big container for the Movie(grid-container)
  const gridContainer = document.createElement("div");
  gridContainer.className = "grid-container";
  rootElem.appendChild(gridContainer);

  // This is the each movie Card container Code(grid-item)
  episodeList.forEach((episode) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridContainer.appendChild(gridItem);

    // This is Movie Title Code both episode-Name and episode-Code
    const episodeCode = getEpisodeCode(episode);
    const episodeTitle = `${episode.name} - ${episodeCode} `;
    const episodeTitleElem = document.createElement("h2");
    episodeTitleElem.textContent = episodeTitle;
    gridItem.appendChild(episodeTitleElem);

    // This is Image Code
    const imgElem = document.createElement("img");
    imgElem.src = episode.image.medium;
    imgElem.alt = episodeTitle;
    gridItem.appendChild(imgElem);

    // This is the Episode summary code
    const summaryElem = document.createElement("summary");
    summaryElem.innerHTML = episode.summary;
    gridItem.appendChild(summaryElem);
  });
}

function addSearchFunctionality(allShows) {
  const searchElem = document.createElement("input");
  searchElem.className = "search-input";
  searchElem.type = "text";
  searchElem.placeholder = "Search shows";
  searchElem.addEventListener("input", () => {
    const searchTerm = searchElem.value.toLowerCase();
    const filteredShows = allShows.filter((show) => {
      const name = show.name.toLowerCase();
      const genres = show.genres.map((genre) => genre.toLowerCase());
      const summary = show.summary.toLowerCase();
      return (
        name.includes(searchTerm) ||
        genres.includes(searchTerm) ||
        summary.includes(searchTerm)
      );
    });
    makeShowsListing(filteredShows);
  });

  const rootElem = document.getElementById("root");
  rootElem.insertBefore(searchElem, rootElem.firstChild);
}

function addSelectFunctionality(allEpisodes) {
  const selectWrapperElem = document.createElement("div");
  selectWrapperElem.className = "select-wrapper";

  // Create episode select input
  const episodeSelectElem = document.createElement("select");
  episodeSelectElem.className = "episode-select";
  episodeSelectElem.addEventListener("change", () => {
    const selectedOption =
      episodeSelectElem.options[episodeSelectElem.selectedIndex];
    const selectedEpisode = allEpisodes.find(
      (episode) => getEpisodeCode(episode) === selectedOption.value
    );
    makePageForEpisodes([selectedEpisode]);
  });

  episodeSelectElem.onchange = function () {
    window.location.hash = `#${episodeSelectElem.value}`;
  };

  // Add option for all episodes
  const allEpisodesOption = document.createElement("option");
  allEpisodesOption.value = "";
  allEpisodesOption.textContent = "All Episodes";
  episodeSelectElem.appendChild(allEpisodesOption);

  // Sort episodes by name in alphabetical order, case-insensitive
  allEpisodes.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  // Add options for each episode
  allEpisodes.forEach((episode) => {
    const episodeOption = document.createElement("option");
    episodeOption.value = getEpisodeCode(episode);
    episodeOption.textContent = getEpisodeCode(episode) + " - " + episode.name;
    episodeSelectElem.appendChild(episodeOption);
  });

  // Add episode select input to select wrapper
  selectWrapperElem.appendChild(episodeSelectElem);

  // Create movie select input
  const movieSelectElem = document.createElement("select");
  movieSelectElem.className = "movie-select";
  movieSelectElem.addEventListener("change", () => {
    const selectedOption =
      movieSelectElem.options[movieSelectElem.selectedIndex];
    const selectedShowId = selectedOption.value;
    if (selectedShowId !== "") {
      const selectedShow = allShows.find(
        (show) => show.name === selectedOption.textContent
      );
      const endpoint = `https://api.tvmaze.com/shows/${selectedShow.id}/episodes`;
      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => makePageForEpisodes(data))
        .catch((error) => console.log(error));
    } else {
      makePageForEpisodes(allEpisodes);
    }
  });

  // Add option for no movie selected
  const noMovieOption = document.createElement("option");
  noMovieOption.value = "";
  noMovieOption.textContent = "Select a Show";
  movieSelectElem.appendChild(noMovieOption);

  // Retrieve the list of shows using getAllShows() function
  const allShows = getAllShows();

  // Extract show names from the objects
  const showNames = allShows.map((show) => show.name);

  // Sort show names in alphabetical order, case-insensitive
  showNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  showNames.forEach((showName) => {
    const showId = showName.toLowerCase().replace(/\s+/g, "-");
    const showOption = document.createElement("option");
    showOption.value = showId;
    showOption.textContent = showName;
    movieSelectElem.appendChild(showOption);
  });

  // Add movie select input to select wrapper
  selectWrapperElem.appendChild(movieSelectElem);

  // Add select wrapper to root element
  const rootElem = document.getElementById("root");
  rootElem.insertBefore(selectWrapperElem, rootElem.firstChild);
}

window.onload = setup;
