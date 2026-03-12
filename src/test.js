import { useEffect, useRef, useState } from "react";
import StarRating from "../src/starComponent";
import { useMovie } from "./useMovie";
import { useLocalStoageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     title: "Inception",
//     year: "2010",
//     poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     title: "Back to the Future",
//     year: "1985",
//     poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "5c65c863";
// const temQuery = "Interstellar";

export default function AApp() {
  const [query, setQuery] = useState("");

  const [selectId, setSelectId] = useState(null);

  // const [watched, setWatched] = useState(function () {
  //   const storedMovie = localStorage.getItem("Watched");
  //   if (storedMovie === null) return [];
  //   return JSON.parse(storedMovie);
  // });

  const [watched, setWatched] = useLocalStoageState([], "Watched");

  function handleMovieDetail(selectedId) {
    setSelectId((id) => (selectedId === id ? null : selectedId));
  }

  function handleCLoseMovieDetails() {
    setSelectId(null);
  }

  function handleWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("Watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteMovie(id) {
    setWatched((watch) => watch.filter((w) => w.imdbID !== id));
  }

  // useEffect(
  //   function () {
  //     localStorage.setItem("Watched", JSON.stringify(watched));
  //   },
  //   [watched],
  // );

  const { movies, isLoading, errors } = useMovie(
    query,
    // handleCLoseMovieDetails,
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        {/* <Box element={<MoviesList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}

        <Box>
          {isLoading && <Loading />}

          {!isLoading && !errors && (
            <MoviesList
              movies={movies}
              key={movies.imdbID}
              selectId={selectId}
              setSelectId={setSelectId}
              onHandleOnClick={handleMovieDetail}
            />
          )}

          {errors && <ErrorMessage message={errors} />}
          {/* {isLoading ? (
            <Loading />
          ) : (
            <MoviesList movies={movies} key={movies.imdbID} />
          )} */}
        </Box>
        <Box>
          {selectId ? (
            <MoviesDetail
              handleCLoseMovieDetails={handleCLoseMovieDetails}
              selectId={selectId}
              onWatchedMovies={handleWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDelete={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>👎</span> {message}
    </div>
  );
}

function NavBar({ children }) {
  return (
    <>
      <nav className="nav-bar">{children}</nav>
    </>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(
  //   function () {
  //     function callBack(e) {
  //       if (document.activeElement === inputEl.current) return;

  //       if (e.code === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callBack);
  //     return () => document.removeEventListener("keydown", callBack);
  //   },
  //   [setQuery],
  // );

  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//
//         </>
//       )}
//     </div>
//   );
// }

function MoviesList({ movies, selectId, setSelectId, onHandleOnClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies
          movie={movie}
          key={movie.id}
          selectId={selectId}
          setSelectId={setSelectId}
          onHandleOnClick={onHandleOnClick}
        />
      ))}
    </ul>
  );
}

function Movies({ movie, selectId, setSelectId, onHandleOnClick }) {
  return (
    <li key={movie.imdbID} onClick={() => onHandleOnClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function MoviesDetail({
  selectId,
  handleCLoseMovieDetails,
  onWatchedMovies,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [customerRating, setCustomerRating] = useState(0);

  const countRef = useRef(0);

  useEffect(
    function () {
      if (customerRating) countRef.current++;
    },
    [customerRating],
  );

  const isWatched = watched.map((watch) => watch.imdbID).includes(selectId);
  // console.log(isWatched);

  const watchedRated = watched.find(
    (movie) => movie.imdbID === selectId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbVotes,
  } = movie;

  // console.log(title, year);
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: customerRating,
      countRatingDecision: countRef.current,
    };

    // console.log(newWatchedMovie);
    onWatchedMovies(newWatchedMovie);
    handleCLoseMovieDetails();
  }

  useKey("Escape", handleCLoseMovieDetails);

  // useEffect(
  //   function () {
  //     function keyEvent(e) {
  //       if (e.code === "Escape") {
  //         handleCLoseMovieDetails();
  //       }
  //     }
  //     document.addEventListener("keydown", keyEvent);
  //     return function () {
  //       document.removeEventListener("keydown", keyEvent);
  //     };
  //   },
  //   [handleCLoseMovieDetails],
  // );

  useEffect(
    function () {
      // function getMovieDetails() {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectId}&apikey=5c65c863`,
        );

        const data = await res.json();
        console.log(data);
        setMovie(data);
        // fetch(`https://www.omdbapi.com/?i=${selectId}&apikey=5c65c863`)
        //   .then((res) => res.json())
        //   .then((data) => setMovie(data));
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectId],
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title],
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCLoseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
                <span>📈</span>
                {imdbVotes}
                {}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    fontSize={32}
                    onConsumerRating={setCustomerRating}
                  />
                  {customerRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You already rated this movie {watchedRated}⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
