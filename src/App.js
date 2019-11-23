import React from "react";
import ReactPlayer from "react-player";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ReactPlayer
          forceAudio
          playing
          controls
          url={[
            {
              src: "file:///absolute/path/to/sound.mp3"
            }
          ]}
        />
      </header>
    </div>
  );
}

export default App;
