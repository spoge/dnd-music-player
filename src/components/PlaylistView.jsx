import React, { useContext } from "react";
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

  const dispatchNextTrack = url => {
    dispatch({
      type: "NEXT_TRACK"
    });
  };

  const dispatchSetTracksForPlaylist = tracks => {
    dispatch({
      type: "SET_TRACKS_FOR_CURRENT_PLAYLIST",
      payload: tracks
    });
  };

  const dispatchLoadPlaylist = playlist => {
    dispatch({
      type: "LOAD_PLAYLIST",
      payload: playlist
    });
  };

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

      Promise.all(promises).then(tracks => {
        dispatchSetTracksForPlaylist(tracks);
      });
    }
  };

  const addToPlaylistClick = async () => {
    const newTracks = await fileUtils.openAudioFiles();

    const promises = newTracks.map(url =>
      mm.fetchFromUrl(url).then(metadata => ({
        url: url,
        title: metadata.common.title,
        album: metadata.common.album,
        artist: metadata.common.artist
      }))
    );

    Promise.all(promises).then(tracks => {
      const newTracks = [...state.currentPlaylist.tracks, ...tracks].reduce(
        (unique, item) => {
          return unique.filter(u => u.url === item.url).length > 0
            ? unique
            : [...unique, item];
        },
        []
      );
      dispatchSetTracksForPlaylist(newTracks);
    });
  };

  const openPlaylist = async () => {
    const newPlaylist = await fileUtils.loadPlaylist();
    if (newPlaylist.name !== "" && newPlaylist.urls.length > 0) {
      const promises = newPlaylist.urls.map(url =>
        mm.fetchFromUrl(url).then(metadata => ({
          url: url,
          title: metadata.common.title,
          album: metadata.common.album,
          artist: metadata.common.artist
        }))
      );

      Promise.all(promises).then(tracks => {
        dispatchLoadPlaylist({ name: newPlaylist.name, tracks: tracks });
      });
    }
  };

  const savePlaylist = async () => {
    if (state.currentPlaylist.tracks.length > 0) {
      const newPlaylist = await fileUtils.savePlaylist({
        name: "",
        urls: state.currentPlaylist.tracks.map(track => track.url)
      });

      if (newPlaylist.name !== "" && newPlaylist.urls.length > 0) {
        const promises = newPlaylist.urls.map(url =>
          mm.fetchFromUrl(url).then(metadata => ({
            url: url,
            title: metadata.common.title,
            album: metadata.common.album,
            artist: metadata.common.artist
          }))
        );

        Promise.all(promises).then(tracks => {
          dispatchLoadPlaylist({
            name: newPlaylist.name,
            tracks: tracks
          });
        });
      }
    }
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
        <PlaylistList />
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
