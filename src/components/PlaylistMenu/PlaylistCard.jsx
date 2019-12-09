import React, { useContext } from "react";
import "./PlaylistMenuView.scss";

import { Store } from "../../Store.js";

const PlaylistCard = ({ playlist }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

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
};

export default PlaylistCard;
