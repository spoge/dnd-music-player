import React, { useContext } from "react";
import "./PlaylistContentView.scss";

import { Store } from "../Store.js";

const PlaylistContentView = () => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div className="track-list">
      {state.currentViewingPlaylist.tracks.length > 0 ? (
        <div className="track-wrapper">
          <div className="track-meta-wrapper">
            <div className="track-item track-item-1-2">
              <h3>TITLE</h3>
            </div>
            <div className="track-item track-item-1-4">
              <h3>ALBUM</h3>
            </div>
            <div className="track-item track-item-1-4 track-item-last">
              <h3>ARTIST</h3>
            </div>
          </div>
          <div className="track-item"></div>
        </div>
      ) : null}
      {state.currentViewingPlaylist.tracks.map(track => {
        return (
          <div className="track-wrapper" key={track.url}>
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
      })}
    </div>
  );
};

export default PlaylistContentView;
