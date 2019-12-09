import React from "react";
import "./App.scss";

import PlaylistPage from "./components/PlaylistPage";

// import { Store } from "./Store.js";

function App() {
  // const globalState = React.useContext(Store);
  // const { state } = globalState;

  // console.log(state);

  return (
    <div className="App">
      <PlaylistPage />
    </div>
  );
}

export default App;
