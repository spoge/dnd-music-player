import React, { useContext } from "react";
import { Store } from "../Store.js";
import "./PlaylistInputRow.scss";

const PlaylistInputRow = ({
  newPlaylistClick,
  addToPlaylistClick,
  openPlaylist,
  savePlaylist
}) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div className="playlist-inputs-wrapper">
      <div className="playlist-input">
        <button onClick={newPlaylistClick}>New playlist</button>
      </div>
      <div className="playlist-input">
        <button onClick={addToPlaylistClick}>Add to playlist</button>
      </div>
      <div className="playlist-input">
        <button onClick={openPlaylist}>Open playlist</button>
      </div>
      <div className="playlist-input">
        <button onClick={savePlaylist}>Save playlist</button>
      </div>
      <div className="playlist-input checkboxes-wrapper">
        <div className="checkbox-wrapper">
          <label>
            <input
              type="checkbox"
              onChange={() =>
                dispatch({
                  type: "TOGGLE_FADING_ENABLED",
                  payload: !state.isFadingEnabled
                })
              }
              checked={state.isFadingEnabled}
            />
            Fade out
          </label>
        </div>
        <div className="checkbox-wrapper">
          <label>
            <input
              type="checkbox"
              onChange={() =>
                dispatch({
                  type: "TOGGLE_LOOPING_PLAYLIST_ENABLED",
                  payload: !state.isPlaylistLooping
                })
              }
              checked={state.isPlaylistLooping}
            />
            Repeat playlist
          </label>
        </div>
        <div className="checkbox-wrapper">
          <label>
            <input
              type="checkbox"
              onChange={() =>
                dispatch({
                  type: "TOGGLE_LOOPING_TRACK_ENABLED",
                  payload: !state.isTrackLooping
                })
              }
              checked={state.isTrackLooping}
            />
            Repeat song
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlaylistInputRow;
