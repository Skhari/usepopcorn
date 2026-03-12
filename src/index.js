import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./starComponent";
import AApp from "./test.js";

import "./index.css";
// import App from "./App";

// function Test() {
//   const [consumerRating, setConsumerRating] = useState(0);
//   return (
//     <div>
//       <StarRating
//         maxRating={5}
//         color="blue"
//         onConsumerRating={setConsumerRating}
//       />
//       <p>{`this movie is rated ${consumerRating} by you`}</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AApp />

    {/* <StarRating
      maxRating={5}
      classname={"text"}
      message={["worst", "okay", "good", "great", "perfect"]}
      defaultRating={3}
    /> */}
    {/* <Test /> */}
  </React.StrictMode>,
);
