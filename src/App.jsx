import React from "react";
import "./App.scss";

import ContextMenuPlaylistPage from "./components/ContextMenuPlaylistPage";
import PlaylistPlayer from "./components/PlaylistPlayer/PlaylistPlayer";

function App() {
  return (
    <div className="App">
      <div>
        <ContextMenuPlaylistPage />
        <div className="player-wrapper">
          <PlaylistPlayer />
        </div>
      </div>
    </div>
  );
}

export default App;
