import React from "react";
import ReactDOM from "react-dom";
import WelcomeLoader from "./app";

const title = "SCAV ME";

ReactDOM.render(<WelcomeLoader />, document.getElementById("root"));

module.hot.accept();
