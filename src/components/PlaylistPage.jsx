import React, { useContext } from "react";
import ReactPlayer from "react-player";
import "./PlaylistPage.scss";
import fileUtils from "../utils/file-util";
import { Store } from "../Store.js";

import * as mm from "music-metadata-browser";
import PlaylistInputsView from "./Input/PlaylistInputsView";
import PlaylistMenuView from "./PlaylistMenu/PlaylistMenuView";
import PlaylistContentView from "./PlaylistContent/PlaylistContentView";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const PlaylistPage = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  const nextTrack = () => {
    dispatch({
      type: "NEXT_TRACK"
    });
  };

  const newPlaylist = () => {
    dispatch({
      type: "NEW_PLAYLIST"
    });
    dispatch({ type: "SAVE_GLOBAL_STATE" });
  };

  const addToPlaylist = async () => {
    if (state.currentViewingPlaylist.name === "") {
      return;
    }
    const newTracks = await fileUtils.openAudioFiles();
    const promises = newTracks.map(url =>
      mm.fetchFromUrl(url).then(metadata => {
        return {
          url: url,
          title: metadata.common.title,
          album: metadata.common.album,
          artist: metadata.common.artist
        };
      })
    );

    Promise.all(promises).then(tracks => {
      const newTracks = [
        ...state.currentViewingPlaylist.tracks,
        ...tracks.filter(track => track.title !== undefined)
      ].reduce((unique, item) => {
        return unique.filter(u => u.url === item.url).length > 0
          ? unique
          : [...unique, item];
      }, []);
      if (newTracks.length !== state.currentViewingPlaylist.tracks.length) {
        dispatch({
          type: "ADD_TRACKS_TO_CURRENT_PLAYLIST",
          payload: newTracks
        });
      }
    });
  };

  const importPlaylists = async () => {
    const newPlaylists = await fileUtils.loadPlaylists();
    if (newPlaylists.length > 0) {
      newPlaylists.forEach(newPlaylist => {
        const promises = newPlaylist.urls.map(url =>
          mm.fetchFromUrl(url).then(metadata => ({
            url: url,
            title: metadata.common.title,
            album: metadata.common.album,
            artist: metadata.common.artist
          }))
        );

        Promise.all(promises).then(tracks => {
          dispatch({
            type: "LOAD_PLAYLIST",
            payload: {
              name: newPlaylist.name,
              tracks: tracks
            }
          });
          dispatch({ type: "SAVE_GLOBAL_STATE" });
        });
      });
    }
  };

  const shouldLoopTrack = () => {
    return (
      state.isTrackLooping ||
      (state.isPlaylistLooping &&
        state.currentPlayingPlaylist.tracks.length === 1)
    );
  };

  return (
    <div>
      <ContextMenuTrigger id="global-context-menu">
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
      </ContextMenuTrigger>
      <ContextMenu id="global-context-menu">
        {state.currentViewingPlaylist.name !== "" ? (
          <>
            <MenuItem onClick={addToPlaylist}>Add tracks to playlist</MenuItem>
            <MenuItem divider />
          </>
        ) : null}
        <MenuItem onClick={newPlaylist}>New playlist</MenuItem>
        <MenuItem onClick={importPlaylists}>Import playlist</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default PlaylistPage;
