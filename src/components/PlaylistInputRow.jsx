import React from "react";
import "./PlaylistInputRow.scss";

const PlaylistInputRow = ({
  openFileClick,
  addToPlaylistClick,
  openPlaylist,
  savePlaylist,
  changeFading,
  isFading,
  changeListLoop,
  isListLooping,
  changeSongLoop,
  isSongLooping
}) => {
  return (
    <div className="playlist-inputs-wrapper">
      <div className="playlist-input">
        <button onClick={openFileClick}>New playlist</button>
      </div>
      <div className="playlist-input">
        <button onClick={addToPlaylistClick}>Add to playlist</button>
      </div>
      <div className="playlist-input">
        <button onClick={openPlaylist}>Open playlist</button>
      </div>
      <div className="playlist-input">
        <button onClick={savePlaylist}>Save playlist</button>
      </div>
      <div className="playlist-input checkboxes-wrapper">
        <div className="checkbox-wrapper">
          <label>
            <input type="checkbox" onChange={changeFading} checked={isFading} />
            Fade out
          </label>
        </div>
        <div className="checkbox-wrapper">
          <label>
            <input
              type="checkbox"
              onChange={changeListLoop}
              checked={isListLooping}
            />
            Repeat playlist
          </label>
        </div>
        <div className="checkbox-wrapper">
          <label>
            <input
              type="checkbox"
              onChange={changeSongLoop}
              checked={isSongLooping}
            />
            Repeat song
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlaylistInputRow;
