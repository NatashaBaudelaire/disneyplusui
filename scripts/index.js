const API_KEY = '03c4e3dc470296959d6bf68804146538'
const API_LANGUAGE = 'en-GB'
const BASE_URL_IMAGE = {
  original: 'https://image.tmdb.org/t/p/original',
  small: 'https://image.tmdb.org/t/p/w500'
}

const movies = []
let movieActive = ''
const moviesElement = document.getElementById('movies')

function getUrlMovie(movieId) {
  return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${API_LANGUAGE}`
}

function getUrlMovieVideos(movieId) {
  return `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=${API_LANGUAGE}`
}

async function getTrailerYoutube(movieId) {
  // Special case for the Spongebob movie to ensure the correct trailer
  if (movieId === 'tt4823776') {
    return 'https://www.youtube.com/embed/a2cowVH03Xo';
  }
  // Special case for the Luca movie
  if (movieId === 'tt12801262') {
    return 'https://www.youtube.com/embed/mYfJxlgR2jw';
  }

  try {
    let response = await fetch(getUrlMovieVideos(movieId))
    let data = await response.json()
    
    const youtubeTrailers = data.results
      .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
      .sort((a, b) => b.size - a.size);

    if (youtubeTrailers.length === 0) {
      return null;
    }

    const trailer = youtubeTrailers.find(video => /official trailer/i.test(video.name)) || youtubeTrailers[0];

    if (trailer) {
      return `https://www.youtube.com/embed/${trailer.key}`
    }
    return null
  } catch (error) {
    console.error('Error fetching trailer:', error)
    return null
  }
}

function changeButtonMenu() {
  const button = document.querySelector('.button__menu')
  const navigation = document.querySelector('.navigation')
  button.classList.toggle('active')
  navigation.classList.toggle('active')
}

function setMainMovie(movie) {
  const appImage = document.querySelector('.app__image img')
  const title = document.querySelector('.feature__movie h1')
  const description = document.querySelector('.feature__movie p')
  const info = document.querySelector('.feature__movie span')
  const rating = document.querySelector('.rating strong')
  title.innerHTML = movie.title
  description.innerHTML = movie.overview
  rating.innerHTML = movie.vote_average
  info.innerHTML = movie.release + ' - ' + movie.genre + ' - Movie'
  appImage.setAttribute('src', movie.image.original)
}

function changeMovieActiveInList(newMovieActive) {
  const movieActiveCurrent = document.getElementById(movieActive)
  if (movieActiveCurrent) {
    movieActiveCurrent.classList.remove('active-movie')
  }
  const movieActiveNew = document.getElementById(newMovieActive)
  if (movieActiveNew) {
    movieActiveNew.classList.add('active-movie')
  }
  movieActive = newMovieActive
}

function changeMainMovie(movieId) {
  changeMovieActiveInList(movieId)
  const movie = movies.find(movie => movie.id === movieId)
  if(movie?.id) {
    setMainMovie(movie)
    changeButtonMenu()
  } else  {
    console.log(movies)
    console.log('Could not find the movie with id', movieId)
  }
}

function createButtonMovie(movieId) {
  const button = document.createElement('button')
  button.setAttribute('onclick', `changeMainMovie('${movieId}')`)
  button.innerHTML = '<img src="/assets/icon-play-button.png" alt="Play button icon" />'
  return button
}

function createImageMovie(movieImage, movieTitle) {
  const divImageMovie = document.createElement('div')
  divImageMovie.classList.add('movie__image')
  const image = document.createElement('img')
  image.setAttribute('src', movieImage)
  image.setAttribute('alt', `Image of the movie ${movieTitle}`)
  image.setAttribute('loading', 'lazy')
  divImageMovie.appendChild(image)
  return divImageMovie
}

function addMovieInList(movie) {
  const movieElement = document.createElement('li')
  movieElement.classList.add('movie')
  movieElement.setAttribute('id', movie.id)
  movieElement.setAttribute('onclick', `changeMainMovie('${movie.id}')`)
  const genre = `<span>${movie.genre}</span>`
  const title = `<strong>${movie.title}</strong>`
  movieElement.innerHTML = genre + title
  movieElement.appendChild(createButtonMovie(movie.id))
  movieElement.appendChild(createImageMovie(movie.image.small, movie.title))
  moviesElement.appendChild(movieElement)
}

async function getMovieData(movieId) {
  const isMovieInList = movies.findIndex(movie => movie.id === movieId)
  if(isMovieInList === -1) {
    try {
      let data = await fetch(getUrlMovie(movieId))
      data = await data.json()
      const movieData = {
        id: movieId,
        title: data.title,
        overview: data.overview,
        vote_average: data.vote_average,
        genre: data.genres[0].name,
        release: data.release_date.split('-')[0],
        image: {
          original: BASE_URL_IMAGE.original.concat(data.backdrop_path),
          small: BASE_URL_IMAGE.small.concat(data.backdrop_path),
        }
      }
      movies.push(movieData)
      return movieData
    } catch(error) {
      console.log('Error message:', error.message)
    }
  }
  return null
}

function loadMovies() {
  const LIST_MOVIES = ['tt12801262', 'tt4823776', 'tt0800369', 'tt3896198', 'tt1211837', 'tt1825683']
  LIST_MOVIES.map(async (movie, index) => {
    const movieData = await getMovieData(movie)
    if (movieData) {
      addMovieInList(movieData)
      if(index === 0) {
        setMainMovie(movieData)
        movieActive = movieData.id
        const movieActiveNew = document.getElementById(movieActive)
        movieActiveNew.classList.add('active-movie')
      }
    }
  })
}

const buttonAddMovie = document.getElementById('add__movie')

function formattedMovieId(movieId) {
  if(movieId.includes('https://www.imdb.com/title/')) {
    const id = movieId.split('/')[4]
    return id
  }
  return movieId
}

buttonAddMovie.addEventListener('submit', async function(event) {
  event.preventDefault()
  const newMovieId = formattedMovieId(event.target['movie'].value)
  const newMovie = await getMovieData(newMovieId)
  if(newMovie?.id) {
    addMovieInList(newMovie)
  }
  event.target['movie'].value = ''
})

const style = document.createElement('style');
style.textContent = `
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
    z-index: 9999;
  }
  .modal-overlay.show {
    opacity: 1;
    pointer-events: auto;
  }
  .modal-content {
    position: relative;
    width: 80%;
    max-width: 900px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.7);
    animation: fadeInScale 0.4s forwards;
  }
  @keyframes fadeInScale {
    from {opacity: 0; transform: scale(0.8);}
    to {opacity: 1; transform: scale(1);}
  }
  .modal-close {
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 28px;
    color: white;
    cursor: pointer;
    z-index: 10;
    user-select: none;
  }
  iframe {
    width: 100%;
    height: 500px;
    border: none;
  }
`;
document.head.appendChild(style);

function createVideoModal(trailerUrl) {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('modal-close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => closeModal());
  const iframe = document.createElement('iframe');
  iframe.src = trailerUrl + '?autoplay=1&rel=0';
  iframe.allow = 'autoplay; encrypted-media';
  iframe.allowFullscreen = true;
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(iframe);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.classList.add('show');
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  function closeModal() {
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    }, {once: true});
  }
}

const watchBtn = document.querySelector('.feature__movie button[type="button"]');
if (watchBtn) {
  watchBtn.addEventListener('click', async () => {
    const trailerUrl = await getTrailerYoutube(movieActive);
    if(trailerUrl) {
      createVideoModal(trailerUrl);
    } else {
      alert('Trailer not available for this movie.');
    }
  });
}

loadMovies()

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  app.classList.remove('fade-in');
  app.style.opacity = 0;
  setTimeout(() => {
    app.style.display = 'none';
    loginScreen.style.display = 'flex';
    loginScreen.classList.remove('fade-out');
    loginScreen.style.opacity = 1;
  }, 500);
});
