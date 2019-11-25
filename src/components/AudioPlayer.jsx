import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./AudioPlayer.scss";
import fileUtils from "../utils/file-util";

import * as mm from "music-metadata-browser";

const AudioPlayer = () => {
  const [files, setFiles] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [nextPlaying, setNextPlaying] = useState("");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const [fadingEnabled, setFadingEnabled] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const [isLooping, setIsLooping] = useState(false);

  // Fade out current playing file, and play the next afterwards
  useEffect(() => {
    let interval = null;
    if (isFading) {
      interval = setInterval(() => {
        if (volume - 0.02 > 0) {
          setVolume(volume - 0.02);
        } else {
          setIsFading(false);
          setVolume(1);
          setCurrentPlaying(nextPlaying);
          setNextPlaying("");
          setPlaying(true);
        }
      }, 10);
    } else if (!isFading) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isFading, nextPlaying, volume]);

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
        setFiles(songFiles);
      });
    }
    setIsFading(false);
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
      setFiles(
        [...files, ...songFiles].reduce((unique, item) => {
          return unique.filter(u => u.url === item.url).length > 0
            ? unique
            : [...unique, item];
        }, [])
      );
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
        setFiles(songFiles);
      });
    }
    setIsFading(false);
  };

  const savePlaylist = async () => {
    await fileUtils.savePlaylist(files.map(file => file.url));
  };

  const playNextSong = url => {
    setNextPlaying("");
    setCurrentUrl(url);
    setCurrentPlaying([{ src: url }]);
    setPlaying(true);
  };

  const playNextSongWithFading = url => {
    setNextPlaying([{ src: url }]);
    setIsFading(true);
    setCurrentUrl(url);
  };

  const stopPlayng = () => {
    setCurrentUrl("");
    setCurrentPlaying("");
    setPlaying(false);
  };

  const play = url => {
    // check if already playing & if current playing is same as next playing
    if (
      currentPlaying !== "" &&
      currentPlaying[0].src !== url &&
      fadingEnabled
    ) {
      playNextSongWithFading(url);
    } else {
      playNextSong(url);
    }
  };

  const nextSong = () => {
    const index = files.findIndex(file => file.url === currentUrl);
    if (index + 1 < files.length) {
      const url = files[index + 1].url;
      playNextSong(url);
    } else {
      if (isLooping) {
        const url = files[0].url;
        playNextSong(url);
      } else {
        stopPlayng();
      }
    }
  };

  return (
    <div className="audio-player">
      <div className="playlist-wrapper">
        <div className="playlist-input-wrapper">
          <div className="button-wrapper">
            <button onClick={openFileClick}>New playlist</button>
          </div>
          <div className="button-wrapper">
            <button onClick={addToPlaylistClick}>Add to playlist</button>
          </div>
          <div className="button-wrapper">
            <button onClick={openPlaylist}>Open playlist</button>
          </div>
          <div className="button-wrapper">
            <button onClick={savePlaylist}>Save playlist</button>
          </div>
          <div className="checkboxes-wrapper">
            <div className="checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  onChange={() => setFadingEnabled(!fadingEnabled)}
                  checked={fadingEnabled}
                />
                Fade out
              </label>
            </div>
            <div className="checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  onChange={() => setIsLooping(!isLooping)}
                  checked={isLooping}
                />
                Loop
              </label>
            </div>
          </div>
        </div>
        <div className="song-list">
          {files.map(file => {
            return (
              <div
                className={`song-wrapper ${
                  currentUrl === file.url ? "current-song" : ""
                }`}
                key={file.url}
                onClick={() => play(file.url)}
              >
                <p>{file.title}</p>
              </div>
            );
          })}
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
          onEnded={nextSong}
          controls
          playing={playing}
          volume={volume}
          url={currentPlaying}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
