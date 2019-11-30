import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player";
import "./PlaylistView.scss";
import fileUtils from "../utils/file-util";
import { Store } from "../Store.js";

import * as mm from "music-metadata-browser";
import PlaylistInputRow from "./PlaylistInputRow";
import PlaylistList from "./PlaylistList";

const PlaylistView = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  //  const [isFading, setIsFading] = useState(false);

  const dispatchNextTrack = url => {
    dispatch({
      type: "NEXT_TRACK"
    });
  };

  const dispatchStartPlaying = url => {
    dispatch({ type: "START_PLAYING" });
  };

  const dispatchStopPlaying = url => {
    dispatch({ type: "STOP_PLAYING" });
  };

  const dispatchSetTracksForPlaylist = tracks => {
    dispatch({
      type: "SET_TRACKS_TO_CURRENT_PLAYLIST",
      payload: tracks
    });
  };

  const dispatchAddTracksForPlaylist = tracks => {
    dispatch({
      type: "ADD_TRACKS_TO_CURRENT_PLAYLIST",
      payload: tracks
    });
  };

  /*
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchVolume = volume => {
    dispatch({ type: "SET_VOLUME", payload: volume });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchPlayNextTrackInQueue = () => {
    dispatch({
      type: "PLAY_NEXT_TRACK_IN_QUEUE"
    });
  };

  
  // TODO: fix this
  // Fade out current playing file, and play the next afterwards
  useEffect(() => {
    let interval = null;
    if (isFading) {
      interval = setInterval(() => {
        const volume = state.volume - 0.02;
        if (volume >= 0) {
          dispatchVolume(volume);
        } else {
          setIsFading(false);
          dispatchPlayNextTrackInQueue();
        }
      }, 10);
    } else if (!isFading) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [dispatchPlayNextTrackInQueue, dispatchVolume, isFading, state.volume]);
*/

  const openFileClick = async () => {
    const newUrls = await fileUtils.openAudioFiles();
    if (newUrls.length > 0) {
      const promises = newUrls.map(url =>
        mm.fetchFromUrl(url).then(metadata => ({
          url: url,
          title: metadata.common.title,
          album: metadata.common.album,
          artist: metadata.common.artist
        }))
      );

      Promise.all(promises).then(songFiles => {
        dispatchSetTracksForPlaylist(songFiles);
      });
    }
    //setIsFading(false);
  };

  const addToPlaylistClick = async () => {
    const newUrls = await fileUtils.openAudioFiles();

    const promises = newUrls.map(url =>
      mm.fetchFromUrl(url).then(metadata => ({
        url: url,
        title: metadata.common.title,
        album: metadata.common.album,
        artist: metadata.common.artist
      }))
    );

    Promise.all(promises).then(songFiles => {
      const newFiles = [...state.currentPlaylistTracks, ...songFiles].reduce(
        (unique, item) => {
          return unique.filter(u => u.url === item.url).length > 0
            ? unique
            : [...unique, item];
        },
        []
      );
      dispatchAddTracksForPlaylist(newFiles);
    });
  };

  const openPlaylist = async () => {
    const newUrls = await fileUtils.loadPlaylist();
    if (newUrls.length > 0) {
      const promises = newUrls.map(url =>
        mm.fetchFromUrl(url).then(metadata => ({
          url: url,
          title: metadata.common.title,
          album: metadata.common.album,
          artist: metadata.common.artist
        }))
      );

      Promise.all(promises).then(songFiles => {
        dispatchSetTracksForPlaylist(songFiles);
      });
    }
    //setIsFading(false);
  };

  const savePlaylist = async () => {
    await fileUtils.savePlaylist(
      state.currentPlaylistTracks.map(file => file.url)
    );
  };

  return (
    <div className="playlist-view">
      <div className="playlist-wrapper">
        <PlaylistInputRow
          openFileClick={openFileClick}
          addToPlaylistClick={addToPlaylistClick}
          openPlaylist={openPlaylist}
          savePlaylist={savePlaylist}
        />
        <PlaylistList startFading={() => {}} />
      </div>

      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          config={{
            file: {
              forceAudio: true
            }
          }}
          onEnded={dispatchNextTrack}
          controls
          playing={state.isPlaying}
          loop={state.isTrackLooping}
          volume={state.volume}
          url={state.currentTrackUrl}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default PlaylistView;
