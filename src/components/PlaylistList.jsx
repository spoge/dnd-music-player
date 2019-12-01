import React, { useContext } from "react";
import "./PlaylistList.scss";

import { Store } from "../Store.js";

const PlaylistList = ({ startFading }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div className="song-list">
      {state.currentPlaylist.tracks.length > 0 ? (
        <div className="song-wrapper">
          <div className="song-item song-item-1-2">
            <h3>TITLE</h3>
          </div>
          <div className="song-item song-item-1-4">
            <h3>ALBUM</h3>
          </div>
          <div className="song-item song-item-1-4">
            <h3>ARTIST</h3>
          </div>
        </div>
      ) : null}
      {state.currentPlaylist.tracks.map(track => {
        return (
          <div
            className={`song-wrapper ${
              state.currentTrackUrl === track.url ? "current-song" : ""
            }`}
            key={track.url}
            onClick={() => {
              /*if (state.isFadingEnabled && state.isPlaying) {
                dispatch({
                  type: "SET_NEXT_TRACK_URL",
                  payload: track.url
                });
                startFading();
              } else {*/
              dispatch({ type: "SET_CURRENT_TRACK_URL", payload: track.url });
              dispatch({ type: "START_PLAYING" });
              //}
            }}
          >
            <div className="song-item song-item-1-2">
              <p>{track.title}</p>
            </div>
            <div className="song-item song-item-1-4">
              <p>{track.album}</p>
            </div>
            <div className="song-item song-item-1-4">
              <p>{track.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistList;
