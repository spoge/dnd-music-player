import React, { useContext, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import SortAscIcon from "@material-ui/icons/ExpandLess";
import SortDescIcon from "@material-ui/icons/ExpandMore";

import "./PlaylistMenuView.scss";
import PlaylistCard from "./PlaylistCard";

import { Store } from "../../Store.js";
import listUtils from "../../utils/list-util";

const PlaylistMenuView = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  const [playlistSort, setPlaylistSort] = useState(""); // "", "asc", "desc"

  const sortPlaylist = () => {
    if (playlistSort === "") {
      setPlaylistSort("desc");
      dispatch({
        type: "REORDER_PLAYLISTS",
        payload: listUtils.sort(state.playlists, "name")
      });
    } else if (playlistSort === "desc") {
      setPlaylistSort("asc");
      dispatch({
        type: "REORDER_PLAYLISTS",
        payload: listUtils.reverseSort(state.playlists, "name")
      });
    } else {
      setPlaylistSort("");
    }
  };

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const playlists = listUtils.reorder(
      state.playlists,
      result.source.index,
      result.destination.index
    );

    setPlaylistSort("");
    dispatch({ type: "REORDER_PLAYLISTS", payload: playlists });
    dispatch({ type: "SAVE_GLOBAL_STATE" });
  };

  const sortIcon = () => {
    return playlistSort === "asc" ? (
      <SortAscIcon />
    ) : playlistSort === "desc" ? (
      <SortDescIcon />
    ) : (
      ""
    );
  };

  return (
    <div className="playlist-menu">
      <div className="playlist-header" onClick={sortPlaylist}>
        <h3>PLAYLIST</h3>
        <div className="playlist-header-icon">{sortIcon()}</div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="PLAYLIST">
          {dropProvided => (
            <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
              {state.playlists.map((playlist, index) => (
                <Draggable
                  key={playlist.name}
                  draggableId={playlist.name}
                  index={index}
                >
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        outline: "none",
                        ...provided.draggableProps.style
                      }}
                    >
                      <PlaylistCard key={playlist.name} playlist={playlist} />
                    </div>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PlaylistMenuView;
