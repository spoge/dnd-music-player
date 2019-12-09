import React, { useContext } from "react";
import "./PlaylistMenuView.scss";

import PlaylistCard from "./PlaylistCard";

import { Store } from "../../Store.js";

const PlaylistMenuView = () => {
  const globalState = useContext(Store);
  const { state } = globalState;

  return (
    <div className="playlist-menu">
      {state.playlists.length > 0 ? (
        <div className="playlist-wrapper">
          <h3>PLAYLIST</h3>
        </div>
      ) : null}
      {state.playlists.map(playlist => (
        <PlaylistCard key={playlist.name} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistMenuView;
