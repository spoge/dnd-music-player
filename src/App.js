import React from "react";
import "./App.css";

import PlaylistView from "./components/PlaylistView";

// import { Store } from "./Store.js";

function App() {
  // const globalState = React.useContext(Store);
  // const { state } = globalState;

  // console.log(state);

  return (
    <div className="App">
      <PlaylistView />
    </div>
  );
}

export default App;
