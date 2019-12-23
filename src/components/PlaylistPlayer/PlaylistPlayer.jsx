import React, { useContext, useRef, useState } from "react";
import ReactPlayer from "react-player";

import IconButton from "@material-ui/core/IconButton";

import "./PlaylistPlayer.scss";

import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import RepeatIcon from "@material-ui/icons/Repeat";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import ShuffleIcon from "@material-ui/icons/Shuffle";

import Slider from "@material-ui/core/Slider";

import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

import { Store } from "../../Store.js";

const PlaylistPlayer = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState();
  const [volume, setVolume] = useState(1);

  const player = useRef();

  const nextTrack = () => {
    setTime(0);
    dispatch({
      type: "NEXT_TRACK"
    });
  };

  const startPlaying = () => {
    if (state.currentTrackUrl !== "") {
      dispatch({
        type: "START_PLAYING"
      });
    }
  };

  const stopPlaying = () => {
    dispatch({
      type: "STOP_PLAYING"
    });
  };

  const toggleIsShuffling = () => {
    dispatch({
      type: "SET_IS_SHUFFLING",
      payload: !state.isShuffling
    });
  };

  const toggleRepeatState = () => {
    dispatch({
      type: "TOGGLE_REPEAT_STATE"
    });
    dispatch({
      type: "SAVE_GLOBAL_STATE"
    });
  };

  const shouldLoopTrack = () => {
    return (
      state.repeatState === "track" ||
      (state.repeatState === "playlist" &&
        state.currentPlayingPlaylist.tracks.length === 1)
    );
  };

  const convertToMMSS = value => {
    if (value === undefined) {
      return "00:00";
    }
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
    let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10
    // if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds; // Return is HH : MM : SS
  };

  return (
    <div>
      <div className="playlist-player">
        <div className="play-pause-button">
          {state.isPlaying ? (
            <IconButton onClick={stopPlaying}>
              <PauseIcon style={{ color: "#000000" }} />
            </IconButton>
          ) : (
            <IconButton onClick={startPlaying}>
              <PlayIcon style={{ color: "#000000" }} />
            </IconButton>
          )}
        </div>

        <div className="time-slider-label">
          {`${convertToMMSS(time)} / ${convertToMMSS(duration)}`}
        </div>
        <div className="time-slider-wrapper">
          <Slider
            value={time}
            min={0}
            max={duration}
            step={1}
            onChangeCommitted={(event, newValue) => {
              event.preventDefault();
              if (duration) {
                player.current.seekTo(newValue);
                setTime(newValue);
              }
            }}
          />
        </div>

        <div className="shuffle-button">
          <IconButton onClick={toggleIsShuffling}>
            {state.isShuffling ? (
              <ShuffleIcon style={{ color: "#000000" }} />
            ) : (
              <ShuffleIcon color="disabled" />
            )}
          </IconButton>
        </div>

        <div className="repeat-button">
          <IconButton onClick={toggleRepeatState}>
            {state.repeatState === "track" ? (
              <RepeatOneIcon style={{ color: "#000000" }} />
            ) : state.repeatState === "playlist" ? (
              <RepeatIcon style={{ color: "#000000" }} />
            ) : (
              <RepeatIcon color="disabled" />
            )}
          </IconButton>
        </div>

        <div className="volume-slider-wrapper">
          <div className="volume-icon">
            <VolumeDown />
          </div>
          <div className="volume-slider">
            <Slider
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(event, newValue) => {
                setVolume(newValue);
                dispatch({ type: "SET_VOLUME", payload: newValue });
              }}
            />
          </div>
          <div className="volume-icon">
            <VolumeUp />
          </div>
        </div>
      </div>
      <ReactPlayer
        ref={player}
        className="react-player"
        config={{
          file: {
            forceAudio: true
          }
        }}
        width="100%"
        height="100%"
        onEnded={nextTrack}
        playing={state.isPlaying}
        loop={shouldLoopTrack()}
        volume={state.volume}
        url={state.currentTrackUrl}
        onDuration={dur => {
          setDuration(dur);
        }}
        onProgress={progress => {
          setTime(progress.playedSeconds);
        }}
        time={time}
      />
    </div>
  );
};

export default PlaylistPlayer;
