import { useState, useEffect } from "react";

const KEY = process.env.REACT_APP_KEY;
export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setErrors("");
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            { signal: controller.signal },
          );

          if (!res.ok) {
            throw new Error("unable to fetch");
          }

          const data = await res.json();
          // console.log(data.Response);
          if (data.Response === "False") {
            throw new Error("Movie not found");
          }
          setMovies(data.Search);
          setErrors("");
          // .then((res) => res.json())
          // .then((data) => setMovies(data.Search));
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setErrors(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        setErrors("");
        return;
      }
      //   handleCLoseMovieDetails();
      //   callBackHandleMovieClose?.();

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query],
  );
  return { movies, isLoading, errors };
}
