import React, { useContext } from "react";
import "./PlaylistMenuView.scss";

import { Store } from "../Store.js";

const PlaylistMenuView = () => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div className="playlist-menu">
      {state.playlists.length > 0 ? (
        <div className="playlist-wrapper">
          <h3>PLAYLIST</h3>
        </div>
      ) : null}
      {state.playlists.map(playlist => {
        return (
          <div
            className={`playlist-wrapper ${
              state.currentViewingPlaylist.name === playlist.name
                ? "selected-playlist"
                : ""
            } ${
              state.currentPlayingPlaylist.name === playlist.name
                ? "current-playlist"
                : ""
            } 
            `}
            key={playlist.name}
            onClick={() => {
              dispatch({
                type: "VIEW_SELECTED_PLAYLIST",
                payload: playlist.name
              });
            }}
          >
            <p>{`${playlist.name}${playlist.saved ? "" : "*"}`}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistMenuView;
