import React, { useContext } from "react";
import ReactPlayer from "react-player";

import "./PlaylistPage.scss";
import { Store } from "../Store.js";

const PlaylistPlayer = () => {
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
  );
};

export default PlaylistPlayer;
