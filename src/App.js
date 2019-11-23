import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./App.css";

const remote = window.require("electron").remote;

const App = () => {
  const [urls, setUrls] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    console.log(JSON.stringify(urls));
  }, [urls]);

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
    console.log(files);
  };

  const addToPlaylistClick = async () => {
    const files = await openFiles();
    setUrls([...urls, ...files]);
  };

  const play = url => {
    setCurrentPlaying([{ src: url }]);
    setPlaying(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="buttons-wrapper">
          <div class="button-wrapper">
            <button onClick={openFileClick}>Open file</button>
          </div>
          <div class="button-wrapper">
            <button onClick={addToPlaylistClick}>Add to playlist</button>
          </div>
        </div>
        <div className="song-list">
          {urls.map(url => {
            return (
              <div className="song-wrapper" key={url} onClick={() => play(url)}>
                <p>{url}</p>
              </div>
            );
          })}
        </div>

        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            config={{
              file: {
                forceAudio: true
              }
            }}
            controls
            playing={playing}
            url={currentPlaying}
            width="100%"
            height="100%"
          />
        </div>
      </header>
    </div>
  );
};

export default App;
