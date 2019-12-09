import React, { useContext } from "react";
import { Store } from "../../Store.js";
import "./PlaylistInputsView.scss";
import InputCheckbox from "./InputCheckbox.jsx";

const PlaylistInputsView = ({
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
        <button onClick={openPlaylist}>Open playlists</button>
      </div>
      <div className="playlist-input">
        <button onClick={savePlaylist}>Save playlist</button>
      </div>
      <div className="playlist-input checkboxes-wrapper">
        {/* <InputCheckbox
          onChange={() =>
            dispatch({
              type: "TOGGLE_FADING_ENABLED",
              payload: !state.isFadingEnabled
            })
          }
          checked={state.isFadingEnabled}
          label="Fade out"
        /> */}
        <InputCheckbox
          onChange={() =>
            dispatch({
              type: "TOGGLE_LOOPING_PLAYLIST_ENABLED",
              payload: !state.isPlaylistLooping
            })
          }
          checked={state.isPlaylistLooping}
          label="Repeat playlist"
        />
        <InputCheckbox
          onChange={() =>
            dispatch({
              type: "TOGGLE_LOOPING_TRACK_ENABLED",
              payload: !state.isTrackLooping
            })
          }
          checked={state.isTrackLooping}
          label="Repeat song"
        />
      </div>
    </div>
  );
};

export default PlaylistInputsView;
