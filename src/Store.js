import React from "react";
import fileUtils from "./utils/file-util";

export const Store = React.createContext();

const StoreProvider = props => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SAVE_GLOBAL_STATE":
        fileUtils.saveToAppData({
          playlists: state.playlists,
          isShuffling: state.isShuffling,
          repeatState: state.repeatState
        });
        return {
          ...state
        };
      case "START_PLAYING":
        return { ...state, isPlaying: true };
      case "STOP_PLAYING":
        return { ...state, isPlaying: false };
      case "SET_IS_SHUFFLING":
        return { ...state, isShuffling: action.payload };
      case "TOGGLE_REPEAT_STATE":
        let nextRepeatState = "";
        if (state.repeatState === "") {
          nextRepeatState = "playlist";
        } else if (state.repeatState === "playlist") {
          nextRepeatState = "track";
        } else {
          nextRepeatState = "";
        }
        return { ...state, repeatState: nextRepeatState };
      case "VIEW_SELECTED_PLAYLIST":
        const selectedPlaylistIndex = state.playlists
          .map(playlist => playlist.name)
          .indexOf(action.payload);

        return {
          ...state,
          currentViewingPlaylist: state.playlists[selectedPlaylistIndex]
        };

      case "CHANGE_PLAYLIST_NAME":
        return {
          ...state,
          playlists: state.playlists.map(playlist =>
            playlist.name === action.payload.oldName
              ? {
                  ...playlist,
                  name: action.payload.newName
                }
              : playlist
          ),
          currentViewingPlaylist:
            state.currentViewingPlaylist.name === action.payload.oldName
              ? {
                  ...state.currentViewingPlaylist,
                  name: action.payload.newName
                }
              : state.currentViewingPlaylist,
          currentPlayingPlaylist:
            state.currentPlayingPlaylist.name === action.payload.oldName
              ? {
                  ...state.currentPlayingPlaylist,
                  name: action.payload.newName
                }
              : state.currentPlayingPlaylist
        };

      case "NEW_PLAYLIST":
        const newPlaylist = {
          name: `New playlist ${state.playlists.length + 1}`,
          tracks: !action.payload ? [] : action.payload
        };

        return {
          ...state,
          playlists: [...state.playlists, newPlaylist],
          currentViewingPlaylist: newPlaylist
        };

      case "DELETE_PLAYLIST":
        return {
          ...state,
          playlists: state.playlists.filter(
            playlist => playlist.name !== action.payload
          ),
          currentTrackUrl:
            state.currentPlayingPlaylist.name === action.payload
              ? ""
              : state.currentTrackUrl,
          currentPlayingPlaylist:
            state.currentPlayingPlaylist.name === action.payload
              ? {
                  name: "",
                  tracks: []
                }
              : state.currentPlayingPlaylist,
          currentViewingPlaylist:
            state.currentViewingPlaylist.name === action.payload
              ? {
                  name: "",
                  tracks: []
                }
              : state.currentViewingPlaylist
        };

      case "LOAD_PLAYLIST":
        const loadedPlaylist = {
          name: action.payload.name,
          tracks: [...action.payload.tracks]
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
                        tracks: [...loadedPlaylist.tracks]
                      }
                    : playlist
                )
              : [...state.playlists, loadedPlaylist],
          currentViewingPlaylist: {
            name: loadedPlaylist.name,
            tracks: [...loadedPlaylist.tracks]
          },
          currentPlayingPlaylist: {
            name:
              state.currentPlayingPlaylist.name === loadedPlaylistName
                ? loadedPlaylist.name
                : state.currentPlayingPlaylist.name,
            tracks: [...state.currentPlayingPlaylist.tracks]
          }
        };
      case "ADD_TRACKS_TO_CURRENT_PLAYLIST":
        return {
          ...state,
          playlists: state.playlists.map(playlist =>
            playlist.name === state.currentViewingPlaylist.name
              ? {
                  name: playlist.name,
                  tracks: [...action.payload]
                }
              : playlist
          ),
          currentViewingPlaylist: {
            name: state.currentViewingPlaylist.name,
            tracks: [...action.payload]
          },
          currentPlayingPlaylist:
            state.currentPlayingPlaylist.name ===
            state.currentViewingPlaylist.name
              ? {
                  name: state.currentPlayingPlaylist.name,
                  tracks: [...action.payload]
                }
              : state.currentPlayingPlaylist
        };
      case "REORDER_CURRENT_PLAYLIST":
        const reorderCurrentPlaylist = {
          name: state.currentViewingPlaylist.name,
          tracks: [...action.payload]
        };
        return {
          ...state,
          currentViewingPlaylist: reorderCurrentPlaylist,
          playlists: state.playlists.map(playlist =>
            playlist.name === state.currentViewingPlaylist.name
              ? reorderCurrentPlaylist
              : playlist
          ),
          currentPlayingPlaylist:
            state.currentPlayingPlaylist.name ===
            state.currentViewingPlaylist.name
              ? reorderCurrentPlaylist
              : state.currentPlayingPlaylist
        };
      case "REORDER_PLAYLISTS":
        return {
          ...state,
          playlists: [...action.payload]
        };
      case "PLAY_SELECTED_TRACK":
        return {
          ...state,
          currentTrackUrl: action.payload,
          isPlaying: true,
          currentPlayingPlaylist: state.currentViewingPlaylist
        };
      case "NEXT_TRACK":
        let currentIndex = state.currentPlayingPlaylist.tracks
          .map(track => track.url)
          .indexOf(state.currentTrackUrl);
        let nextUrl = state.currentTrackUrl;
        let isPlaying = state.isPlaying;

        // Shuffle only if shuffle is enabled, repeat-state is not for track, and is more than one track in playlist
        if (state.isShuffling) {
          const randomTracks = [...state.currentPlayingPlaylist.tracks];
          randomTracks.splice(currentIndex, 1);
          // Number between 0 and randomTracks.length (inclusive of 0, but not of length)
          const randomIndex = Math.floor(
            Math.random() * Math.floor(randomTracks.length)
          );
          nextUrl = randomTracks[randomIndex].url;
        } // next song exists
        else if (
          currentIndex + 1 <
          state.currentPlayingPlaylist.tracks.length
        ) {
          nextUrl = state.currentPlayingPlaylist.tracks[currentIndex + 1].url;
        } // last song, loop if repeatState is set to playlist
        else if (state.repeatState === "playlist") {
          nextUrl = state.currentPlayingPlaylist.tracks[0].url;
        } else {
          isPlaying = false;
        }

        return {
          ...state,
          currentTrackUrl: nextUrl,
          isPlaying
        };
      case "DELETE_SELECTED_TRACK":
        const thisPlaylist = {
          name: state.currentViewingPlaylist.name,
          tracks: state.currentViewingPlaylist.tracks.filter(
            track => track.url !== action.payload
          )
        };

        return {
          ...state,
          currentViewingPlaylist: thisPlaylist,
          currentPlayingPlaylist:
            thisPlaylist.name === state.currentPlayingPlaylist.name
              ? thisPlaylist
              : state.currentPlayingPlaylist,
          playlists: state.playlists.map(playlist =>
            playlist.name === thisPlaylist.name ? thisPlaylist : playlist
          ),
          currentTrackUrl:
            state.currentTrackUrl === action.payload &&
            state.currentViewingPlaylist.name ===
              state.currentPlayingPlaylist.name
              ? ""
              : state.currentTrackUrl
        };
      default:
        return state;
    }
  };

  const loadedState = fileUtils.loadFromAppData();

  const [state, dispatch] = React.useReducer(reducer, loadedState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};

export default StoreProvider;
