import React, { useContext } from "react";
import "./PlaylistContentView.scss";

import TrackCard from "./TrackCard";

import { Store } from "../../Store.js";

const PlaylistContentView = () => {
  const globalState = useContext(Store);
  const { state } = globalState;

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
      {state.currentViewingPlaylist.tracks.map(track => (
        <TrackCard key={track.url} track={track} />
      ))}
    </div>
  );
};

export default PlaylistContentView;
