import React from "react";

export const Store = React.createContext();

const initialState = {
  playlists: [],
  currentPlaylist: {
    name: "",
    tracks: [],
    saved: false
  },
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
      case "PLAY_SELECTED_PLAYLIST":
        const selectedPlaylistIndex = state.playlists
          .map(playlist => playlist.name)
          .indexOf(action.payload);

        return {
          ...state,
          currentPlaylist: state.playlists[selectedPlaylistIndex]
        };

      case "NEW_PLAYLIST":
        const newPlaylist = {
          name: `New playlist ${state.playlists.length + 1}`,
          tracks: action.payload,
          saved: false
        };

        return {
          ...state,
          playlists: [...state.playlists, newPlaylist],
          currentPlaylist: newPlaylist
        };

      case "LOAD_PLAYLIST":
        const loadedPlaylist = {
          name: action.payload.name,
          tracks: [...action.payload.tracks],
          saved: true
        };

        const loadedPlaylistName =
          action.payload.previousName === undefined ||
          action.payload.previousName === ""
            ? action.payload.name
            : action.payload.previousName;

        let duplicatePlaylistIndex = state.playlists
          .map(playlist => playlist.name)
          .indexOf(loadedPlaylistName);

        return {
          ...state,
          playlists:
            // Add new playlist to playlists, if its name doesn't appear there already.
            // But if it already exists, replace tracks of that playlist.
            duplicatePlaylistIndex !== -1
              ? state.playlists.map((playlist, index) =>
                  index === duplicatePlaylistIndex
                    ? {
                        name: loadedPlaylist.name,
                        tracks: [...loadedPlaylist.tracks],
                        saved: loadedPlaylist.saved
                      }
                    : playlist
                )
              : [...state.playlists, loadedPlaylist],
          currentPlaylist: {
            name: action.payload.name,
            tracks: [...action.payload.tracks],
            saved: action.payload.saved
          },
          currentIndex: 0,
          currentUrl: loadedPlaylist.tracks[0]
        };
      case "ADD_TRACKS_TO_CURRENT_PLAYLIST":
        return {
          ...state,
          playlists: state.playlists.map(playlist =>
            playlist.name === state.currentPlaylist.name
              ? {
                  name: playlist.name,
                  tracks: [...action.payload],
                  saved: false
                }
              : playlist
          ),
          currentPlaylist: {
            name: state.currentPlaylist.name,
            tracks: [...action.payload],
            saved: false
          }
        };
      case "PLAY_SELECTED_TRACK":
        return {
          ...state,
          currentTrackUrl: action.payload,
          isPlaying: true
        };
      case "NEXT_TRACK":
        let nextIndex = state.currentPlaylist.tracks
          .map(track => track.url)
          .indexOf(state.currentTrackUrl);
        let nextUrl = state.currentTrackUrl;
        let isPlaying = state.isPlaying;

        // next song exists
        if (nextIndex + 1 < state.currentPlaylist.tracks.length) {
          // selected playlist contains current track
          if (
            state.currentPlaylist.tracks
              .map(tracks => tracks.url)
              .filter(url => state.currentTrackUrl === url).length > 0
          ) {
            nextUrl = state.currentPlaylist.tracks[nextIndex + 1].url;
          } // selected playlist doesn't contain current track, i.e. viewing another playlist
          else {
            nextUrl = state.currentPlaylist.tracks[0].url;
          }
        } // last song, loop if isPlaylistLooping is set
        else if (state.isPlaylistLooping) {
          nextUrl = state.currentPlaylist.tracks[0].url;
        } else {
          isPlaying = false;
        }

        return {
          ...state,
          currentTrackUrl: nextUrl,
          isPlaying
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};

export default StoreProvider;
