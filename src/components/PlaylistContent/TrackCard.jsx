import React, { useContext } from "react";
import "./PlaylistContentView.scss";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { Store } from "../../Store.js";

const TrackCard = ({ track }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  const Easing = {
    // no easing, no acceleration
    linear(t) {
      return t;
    },
    // decelerating to zero velocity
    easeOutQuad(t) {
      return t * (2 - t);
    }
  };

  function fadeOut(duration = 1000) {
    const end = new Date().getTime() + duration;
    const initialVolume = state.volume;
    dispatch({ type: "SET_IS_SWITCHING_TRACKS", payload: true });

    const doFadeOut = () => {
      const current = new Date().getTime();
      const remaining = end - current;

      if (remaining <= 0) {
        dispatch({ type: "SET_VOLUME", payload: 0 });
        dispatch({ type: "PLAY_SELECTED_TRACK", payload: track.url });
        dispatch({ type: "SET_VOLUME", payload: initialVolume });
        dispatch({ type: "SET_IS_SWITCHING_TRACKS", payload: false });
        return;
      }

      const volume = Easing.linear((remaining / duration) * initialVolume);
      dispatch({ type: "SET_VOLUME", payload: volume });
      requestAnimationFrame(doFadeOut);
    };

    doFadeOut();
  }

  const handleTrackClick = trackUrl => {
    if (state.isSwitchingTracks || state.currentTrackUrl === trackUrl) return;
    state.currentTrackUrl === "" || !state.isPlaying
      ? dispatch({ type: "PLAY_SELECTED_TRACK", payload: track.url })
      : fadeOut();
  };

  return (
    <div>
      <ContextMenuTrigger id={track.url}>
        <div className="track-wrapper">
          <div
            className={`track-meta-wrapper ${
              state.currentTrackUrl === track.url ? "current-track" : ""
            }`}
            onClick={() => handleTrackClick(track.url)}
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
            dispatch({ type: "SAVE_GLOBAL_STATE" });
          }}
        >{`Delete "${track.title}"`}</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default TrackCard;
