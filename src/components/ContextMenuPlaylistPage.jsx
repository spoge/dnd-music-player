import React, { useContext } from "react";

import fileUtils from "../utils/file-util";
import { Store } from "../Store.js";

import * as mm from "music-metadata-browser";
import DroppablePlaylistPage from "./DroppablePlaylistPage";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const ContextMenuPlaylist = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  const newPlaylist = () => {
    dispatch({
      type: "NEW_PLAYLIST"
    });
    dispatch({ type: "SAVE_GLOBAL_STATE" });
  };

  const loadTracks = async newTracks => {
    if (state.currentViewingPlaylist.name !== "" && newTracks.length > 0) {
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
          dispatch({ type: "SAVE_GLOBAL_STATE" });
        }
      });
    }
  };

  const addToPlaylist = async () => {
    if (state.currentViewingPlaylist.name === "") {
      return;
    }
    const newTracks = await fileUtils.openAudioFiles();
    await loadTracks(newTracks);
  };

  const loadPlaylists = async newPlaylists => {
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

  const loadPlaylistsFromDialog = async () => {
    const newPlaylists = await fileUtils.loadPlaylistsFromDialog();
    loadPlaylists(newPlaylists);
  };

  return (
    <div>
      <ContextMenuTrigger id="global-context-menu">
        <DroppablePlaylistPage
          loadTracks={loadTracks}
          loadPlaylists={loadPlaylists}
        />
      </ContextMenuTrigger>
      <ContextMenu id="global-context-menu">
        {state.currentViewingPlaylist.name !== "" ? (
          <>
            <MenuItem onClick={addToPlaylist}>Add tracks to playlist</MenuItem>
            <MenuItem divider />
          </>
        ) : null}
        <MenuItem onClick={newPlaylist}>New playlist</MenuItem>
        <MenuItem onClick={loadPlaylistsFromDialog}>Import playlist</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default ContextMenuPlaylist;
