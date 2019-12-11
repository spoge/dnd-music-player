import React, { useContext, useState } from "react";
import "./PlaylistMenuView.scss";
import "../../styles/react-contextmenu.scss";

import { Store } from "../../Store.js";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const PlaylistCard = ({ playlist }) => {
  const globalState = useContext(Store);
  const { dispatch, state } = globalState;

  const deletePlaylist = () => {
    dispatch({ type: "DELETE_PLAYLIST", payload: playlist.name });
  };

  return (
    <div>
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

      <ContextMenu id={playlist.name}>
        <MenuItem onClick={() => console.log("Edit!")}>Edit name</MenuItem>
        <MenuItem divider />
        <MenuItem onClick={deletePlaylist}>Delete</MenuItem>
      </ContextMenu>
    </div>
  );
};

export default PlaylistCard;
