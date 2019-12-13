import React, { useContext, useState } from "react";
import "./PlaylistMenuView.scss";
import "../../styles/react-contextmenu.scss";

import { Store } from "../../Store.js";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const PlaylistCard = ({ playlist }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  const [isEditable, setIsEditable] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);

  const deletePlaylist = () => {
    dispatch({ type: "DELETE_PLAYLIST", payload: playlist.name });
  };

  const handleOnBlur = () => {
    setIsEditable(false);
    if (playlist.name !== playlistName) {
      dispatch({
        type: "CHANGE_PLAYLIST_NAME",
        payload: { oldName: playlist.name, newName: playlistName }
      });
    }
  };

  const handleKeyPress = e => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
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
            <p>{`${playlist.name}${playlist.saved ? "" : "*"}`}</p>
          </div>
        </ContextMenuTrigger>
      )}

      <ContextMenu id={playlist.name}>
        <MenuItem onClick={() => setIsEditable(!isEditable)}>
          Edit name
        </MenuItem>
        <MenuItem divider />
        <MenuItem
          onClick={deletePlaylist}
        >{`Delete "${playlist.name}"`}</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default PlaylistCard;
