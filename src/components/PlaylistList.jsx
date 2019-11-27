import React from "react";
import "./PlaylistList.scss";

const PlaylistList = ({ files, play, currentUrl }) => {
  return (
    <div className="song-list">
      {files.length > 0 ? (
        <div className="song-wrapper">
          <div className="song-item song-item-1-2">
            <h3>TITLE</h3>
          </div>
          <div className="song-item song-item-1-4">
            <h3>ALBUM</h3>
          </div>
          <div className="song-item song-item-1-4">
            <h3>ARTIST</h3>
          </div>
        </div>
      ) : null}
      {files.map(file => {
        return (
          <div
            className={`song-wrapper ${
              currentUrl === file.url ? "current-song" : ""
            }`}
            key={file.url}
            onClick={() => play(file.url)}
          >
            <div className="song-item song-item-1-2">
              <p>{file.title}</p>
            </div>
            <div className="song-item song-item-1-4">
              <p>{file.album}</p>
            </div>
            <div className="song-item song-item-1-4">
              <p>{file.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistList;
