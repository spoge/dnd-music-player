import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./App.css";

const remote = window.require("electron").remote;

const App = () => {
  const [urls, setUrls] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [nextPlaying, setNextPlaying] = useState("");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const [isFading, setIsFading] = useState(false);

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

  const fadeOut = () => {
    setIsFading(true);
  };

  const openFiles = async () => {
    const files = await remote.dialog.showOpenDialog({
      title: "Open Files",
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Audio Files", extensions: ["mp3"] }]
    });

    if (!files || files.canceled || files.filePaths === 0) {
      return [];
    }
    return files.filePaths;
  };

  const openFileClick = async () => {
    const files = await openFiles();
    if (files.length > 0) {
      setUrls([...files]);
    }
    setIsFading(false);
  };

  const addToPlaylistClick = async () => {
    const files = await openFiles();
    setUrls(
      [...urls, ...files].reduce((unique, item) => {
        return unique.includes(item) ? unique : [...unique, item];
      }, [])
    );
  };

  const play = url => {
    // check if already playing & if current playing is same as next playing
    if (currentPlaying !== "" && currentPlaying[0].src !== url) {
      setNextPlaying([{ src: url }]);
      fadeOut();
    } else {
      setCurrentPlaying([{ src: url }]);
      setPlaying(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-wrapper">
          <div className="buttons-wrapper">
            <div className="button-wrapper">
              <button onClick={openFileClick}>New playlist</button>
            </div>
            <div className="button-wrapper">
              <button onClick={addToPlaylistClick}>Add to playlist</button>
            </div>
          </div>
          <div className="song-list">
            {urls.map(url => {
              return (
                <div
                  className="song-wrapper"
                  key={url}
                  onClick={() => play(url)}
                >
                  <p>{url}</p>
                </div>
              );
            })}
          </div>
        </div>
      </header>
      <footer>
        <div className="footer-wrapper">
          <ReactPlayer
            className="react-player"
            config={{
              file: {
                forceAudio: true
              }
            }}
            controls
            playing={playing}
            volume={volume}
            url={currentPlaying}
            width="100%"
            height="100%"
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
