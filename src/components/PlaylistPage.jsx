import React, { useContext } from "react";
import ReactPlayer from "react-player";

import "./PlaylistPage.scss";
import { Store } from "../Store.js";

import PlaylistInputsView from "./Input/PlaylistInputsView";
import PlaylistMenuView from "./PlaylistMenu/PlaylistMenuView";
import PlaylistContentView from "./PlaylistContent/PlaylistContentView";

const PlaylistPage = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  const nextTrack = () => {
    dispatch({
      type: "NEXT_TRACK"
    });
  };

  const shouldLoopTrack = () => {
    return (
      state.isTrackLooping ||
      (state.isPlaylistLooping &&
        state.currentPlayingPlaylist.tracks.length === 1)
    );
  };

  return (
    <div className="playlist-page">
      <div className="playlist-wrapper">
        <div className="playlist-contents-wrapper">
          <div className="playlist-menu-wrapper size-1-4">
            <PlaylistMenuView />
          </div>
          <div className="playlist-content-wrapper size-3-4">
            <PlaylistContentView />
          </div>
        </div>
        <div className="input-checkbox-wrapper">
          <PlaylistInputsView />
        </div>
      </div>

      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          config={{
            file: {
              forceAudio: true
            }
          }}
          onEnded={nextTrack}
          controls
          playing={state.isPlaying}
          loop={shouldLoopTrack()}
          volume={state.volume}
          url={state.currentTrackUrl}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default PlaylistPage;
