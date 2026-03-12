import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      function keyEvent(e) {
        if (e.code === key) {
          action();
        }
      }
      document.addEventListener("keydown", keyEvent);
      return function () {
        document.removeEventListener("keydown", keyEvent);
      };
    },
    [key, action],
  );
}
