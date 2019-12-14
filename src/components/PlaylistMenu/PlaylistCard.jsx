import React, { useContext, useState } from "react";
import "./PlaylistMenuView.scss";
import "../../styles/react-contextmenu.scss";

import { Store } from "../../Store.js";
import fileUtils from "../../utils/file-util";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const PlaylistCard = ({ playlist }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  const [isEditable, setIsEditable] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);

  const deletePlaylist = () => {
    dispatch({ type: "DELETE_PLAYLIST", payload: playlist.name });
    dispatch({ type: "SAVE_GLOBAL_STATE" });
  };

  const handleOnBlur = () => {
    setIsEditable(false);
    if (playlist.name !== playlistName) {
      dispatch({
        type: "CHANGE_PLAYLIST_NAME",
        payload: { oldName: playlist.name, newName: playlistName }
      });
      dispatch({ type: "SAVE_GLOBAL_STATE" });
    }
  };

  const handleKeyPress = e => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  };

  const savePlaylist = async () => {
    await fileUtils.savePlaylist({
      name: playlist.name,
      urls: playlist.tracks.map(track => track.url)
    });
  };

  return (
    <div>
      {isEditable ? (
        <div className="input-wrapper">
          <input
            autoFocus
            type="text"
            value={playlistName}
            id={playlist.name}
            onChange={e => setPlaylistName(e.target.value)}
            onBlur={handleOnBlur}
            onKeyDown={e => handleKeyPress(e)}
          />
        </div>
      ) : (
        <ContextMenuTrigger id={playlist.name}>
          <div
            className={`playlist-wrapper ${
              state.currentViewingPlaylist.name === playlist.name
                ? "selected-playlist"
                : ""
            } ${
              state.currentPlayingPlaylist.name === playlist.name
                ? "current-playlist"
                : ""
            } 
            `}
            onClick={() => {
              dispatch({
                type: "VIEW_SELECTED_PLAYLIST",
                payload: playlist.name
              });
            }}
          >
            <p>{playlist.name}</p>
          </div>
        </ContextMenuTrigger>
      )}

      <ContextMenu id={playlist.name}>
        <MenuItem onClick={() => setIsEditable(!isEditable)}>
          Edit name
        </MenuItem>
        <MenuItem onClick={savePlaylist}>{`Export as...`}</MenuItem>
        <MenuItem divider />
        <MenuItem
          onClick={deletePlaylist}
        >{`Delete "${playlist.name}"`}</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default PlaylistCard;
