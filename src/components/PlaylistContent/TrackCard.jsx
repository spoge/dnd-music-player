import React, { useContext } from "react";
import "./PlaylistContentView.scss";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { Store } from "../../Store.js";

const TrackCard = ({ track }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  return (
    <div>
      <ContextMenuTrigger id={track.url}>
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
            <div className="track-item track-item-1-4">
              <p>{track.artist}</p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenu id={track.url}>
        <MenuItem
          onClick={() => {
            dispatch({ type: "DELETE_SELECTED_TRACK", payload: track.url });
          }}
        >{`Delete "${track.title}"`}</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default TrackCard;
