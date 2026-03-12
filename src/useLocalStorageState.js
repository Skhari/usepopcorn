import { useState, useEffect } from "react";

export function useLocalStoageState(initialValue, key) {
  const [watched, setWatched] = useState(function () {
    const storedMovie = localStorage.getItem(key);
    if (storedMovie === null) return [];
    return storedMovie ? JSON.parse(storedMovie) : initialValue;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(watched));
    },
    [watched, key],
  );
  return [watched, setWatched];
}
