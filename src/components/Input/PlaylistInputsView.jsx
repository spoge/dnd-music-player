import React, { useContext } from "react";
import { Store } from "../../Store.js";
import "./PlaylistInputsView.scss";
import InputCheckbox from "./InputCheckbox.jsx";

const PlaylistInputsView = () => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div className="playlist-inputs-wrapper">
      <div className="playlist-input checkboxes-wrapper">
        <InputCheckbox
          onChange={() => {
            dispatch({
              type: "TOGGLE_LOOPING_PLAYLIST_ENABLED",
              payload: !state.isPlaylistLooping
            });
            dispatch({ type: "SAVE_GLOBAL_STATE" });
          }}
          checked={state.isPlaylistLooping}
          label="Repeat playlist"
        />
        <InputCheckbox
          onChange={() => {
            dispatch({
              type: "TOGGLE_LOOPING_TRACK_ENABLED",
              payload: !state.isTrackLooping
            });
            dispatch({ type: "SAVE_GLOBAL_STATE" });
          }}
          checked={state.isTrackLooping}
          label="Repeat song"
        />
      </div>
    </div>
  );
};

export default PlaylistInputsView;
