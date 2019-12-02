import React from "react";

export const Store = React.createContext();

const initialState = {
  playlists: [],
  currentPlaylist: {
    name: "",
    tracks: []
  },
  currentTrackIndex: 0,
  currentTrackUrl: "",
  nextTrackUrl: "",
  isPlaying: false,
  isPlaylistLooping: true,
  isTrackLooping: false,
  volume: 1
};

const StoreProvider = props => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE_IS_PLAYING":
        return { ...state, isPlaying: action.payload };
      case "START_PLAYING":
        return { ...state, isPlaying: true };
      case "STOP_PLAYING":
        return { ...state, isPlaying: false };
      case "TOGGLE_LOOPING_PLAYLIST_ENABLED":
        return { ...state, isPlaylistLooping: action.payload };
      case "TOGGLE_LOOPING_TRACK_ENABLED":
        return { ...state, isTrackLooping: action.payload };
      case "SELECT_CURRENT_PLAYLIST":
        return {
          ...state,
          currentPlaylist: state.playlists[action.payload],
          currentIndex: 0,
          currentUrl: state.playlists[action.payload].tracks[0]
        };
      case "LOAD_PLAYLIST":
        const newPlaylist = {
          name: action.payload.name,
          tracks: [...action.payload.tracks]
        };

        let duplicatePlaylistIndex = state.playlists
          .map(playlist => playlist.name)
          .indexOf(newPlaylist.name);

        return {
          ...state,
          playlists:
            // Add new playlist to playlists, if its name doesn't appear there already.
            // But if it already exists, replace tracks of that playlist.
            duplicatePlaylistIndex !== -1
              ? state.playlists.map((playlist, index) =>
                  index === duplicatePlaylistIndex
                    ? {
                        name: playlist.name,
                        tracks: [...newPlaylist.tracks]
                      }
                    : playlist
                )
              : [...state.playlists, newPlaylist],
          currentPlaylist: {
            name: action.payload.name,
            tracks: [...action.payload.tracks]
          },
          currentIndex: 0,
          currentUrl: newPlaylist.tracks[0]
        };
      case "SET_TRACKS_FOR_CURRENT_PLAYLIST":
        return {
          ...state,
          currentPlaylist: {
            name: state.currentPlaylist,
            tracks: [...action.payload]
          }
        };
      case "PLAY_SELECTED_TRACK":
        return {
          ...state,
          currentTrackUrl: action.payload,
          currentTrackIndex: state.currentPlaylist.tracks
            .map(track => track.url)
            .indexOf(action.payload),
          isPlaying: true
        };
      case "NEXT_TRACK":
        let nextIndex = state.currentTrackIndex;
        let nextUrl = state.currentTrackUrl;
        let isPlaying = state.isPlaying;
        if (state.currentTrackIndex + 1 < state.currentPlaylist.tracks.length) {
          nextIndex = state.currentTrackIndex + 1;
          nextUrl = state.currentPlaylist.tracks[nextIndex].url;
        } else if (state.isPlaylistLooping) {
          nextIndex = 0;
          nextUrl = state.currentPlaylist.tracks[nextIndex].url;
        } else {
          isPlaying = false;
        }

        return {
          ...state,
          currentTrackIndex: nextIndex,
          currentTrackUrl: nextUrl,
          isPlaying
        };
      case "PREVIOUS_TRACK":
        const previousIndex =
          state.currentTrackIndex - 1 >= 0
            ? state.currentTrackIndex - 1
            : state.isPlaylistLooping
            ? state.currentPlaylist.tracks.length - 1
            : -1;
        return { ...state, currentTrackIndex: previousIndex };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};

export default StoreProvider;
