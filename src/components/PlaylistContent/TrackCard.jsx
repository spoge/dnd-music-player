import React, { useContext } from "react";
import "./PlaylistContentView.scss";

import { Store } from "../../Store.js";

const TrackCard = ({ track }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div className="track-wrapper">
      <div
        className={`track-meta-wrapper ${
          state.currentTrackUrl === track.url ? "current-track" : ""
        }`}
        onClick={() => {
          dispatch({ type: "PLAY_SELECTED_TRACK", payload: track.url });
        }}
      >
        <div className="track-item track-item-1-2">
          <p>{track.title}</p>
        </div>
        <div className="track-item track-item-1-4">
          <p>{track.album}</p>
        </div>
        <div className="track-item track-item-1-4 track-item-last">
          <p>{track.artist}</p>
        </div>
      </div>
      <div
        className="track-item"
        onClick={() => {
          dispatch({ type: "DELETE_SELECTED_TRACK", payload: track.url });
        }}
      >
        <p>X</p>
      </div>
    </div>
  );
};

export default TrackCard;
