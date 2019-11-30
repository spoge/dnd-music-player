import React from "react";

export const Store = React.createContext();

const initialState = {
  playlists: [],
  currentPlaylistTracks: [],
  currentTrackIndex: 0,
  currentTrackUrl: "",
  nextTrackUrl: "",
  isPlaying: false,
  isFading: false,
  isFadingEnabled: true,
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
      case "START_FADING":
        return { ...state, isFading: true };
      case "STOP_FADING":
        return { ...state, isFading: false };
      case "TOGGLE_FADING_ENABLED":
        return { ...state, isFadingEnabled: action.payload };
      case "TOGGLE_LOOPING_PLAYLIST_ENABLED":
        return { ...state, isPlaylistLooping: action.payload };
      case "TOGGLE_LOOPING_TRACK_ENABLED":
        return { ...state, isTrackLooping: action.payload };
      case "SET_NEXT_TRACK_URL":
        return { ...state, nextTrackUrl: action.payload };
      case "SET_VOLUME":
        return { ...state, volume: action.payload };
      case "SET_TRACKS_TO_CURRENT_PLAYLIST":
        return {
          ...state,
          currentPlaylistTracks: [...action.payload]
        };
      case "ADD_TRACKS_TO_CURRENT_PLAYLIST":
        return {
          ...state,
          currentPlaylistTracks: [...action.payload]
        };
      case "SET_CURRENT_TRACK_INDEX":
        const trackUrl = state.currentPlaylistTracks[action.payload];
        return {
          ...state,
          currentTrackIndex: action.payload,
          currentTrackUrl: trackUrl
        };
      case "SET_CURRENT_TRACK_URL":
        const trackIndex = state.currentPlaylistTracks
          .map(track => track.url)
          .indexOf(action.payload);
        return {
          ...state,
          currentTrackUrl: action.payload,
          currentTrackIndex: trackIndex
        };
      case "PLAY_NEXT_TRACK_IN_QUEUE":
        return {
          ...state,
          volume: 1,
          currentTrackIndex: state.currentPlaylistTracks
            .map(track => track.url)
            .indexOf(action.payload),
          currentTrackUrl: state.nextTrackUrl,
          nextTrackUrl: "",
          isPlaying: true
        };
      case "NEXT_TRACK":
        let nextIndex = state.currentTrackIndex;
        let nextUrl = state.currentTrackUrl;
        let isPlaying = state.isPlaying;
        if (state.currentTrackIndex + 1 < state.currentPlaylistTracks.length) {
          nextIndex = state.currentTrackIndex + 1;
          nextUrl = state.currentPlaylistTracks[nextIndex].url;
        } else if (state.isPlaylistLooping) {
          nextIndex = 0;
          nextUrl = state.currentPlaylistTracks[nextIndex].url;
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
            ? state.currentPlaylistTracks.length - 1
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
