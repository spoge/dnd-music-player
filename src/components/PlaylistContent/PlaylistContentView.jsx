import React, { useContext, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import SortAscIcon from "@material-ui/icons/ExpandLess";
import SortDescIcon from "@material-ui/icons/ExpandMore";

import "./PlaylistContentView.scss";

import TrackCard from "./TrackCard";

import { Store } from "../../Store.js";
import listUtils from "../../utils/list-util";

const PlaylistContentView = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

  const [titleSort, setTitleSort] = useState("");
  const [albumSort, setAlbumSort] = useState("");
  const [artistSort, setArtistSort] = useState("");

  const resetSorting = () => {
    setTitleSort("");
    setAlbumSort("");
    setArtistSort("");
  };

  useEffect(() => {
    resetSorting();
  }, [state.currentViewingPlaylist.name]);

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = listUtils.reorder(
      state.currentViewingPlaylist.tracks,
      result.source.index,
      result.destination.index
    );

    resetSorting();
    dispatch({ type: "REORDER_CURRENT_PLAYLIST", payload: items });
    dispatch({ type: "SAVE_GLOBAL_STATE" });
  };

  const sortIcon = sortKey => {
    if (sortKey === "asc") {
      return <SortAscIcon />;
    } else if (sortKey === "desc") {
      return <SortDescIcon />;
    } else {
      return "";
    }
  };

  const sort = (value, setter, sortProperty) => {
    resetSorting();
    if (value === "") {
      setter("desc");
      dispatch({
        type: "REORDER_CURRENT_PLAYLIST",
        payload: listUtils.sort(
          state.currentViewingPlaylist.tracks,
          sortProperty
        )
      });
    } else if (value === "desc") {
      setter("asc");
      dispatch({
        type: "REORDER_CURRENT_PLAYLIST",
        payload: listUtils.reverseSort(
          state.currentViewingPlaylist.tracks,
          sortProperty
        )
      });
    } else {
      setter("");
    }
  };

  return (
    <div className="track-list">
      <div className="track-header">
        <div className="track-meta-wrapper">
          <div
            className="track-item track-item-1-2"
            onClick={() => sort(titleSort, setTitleSort, "title")}
          >
            <div className="track-header-inner-wrapper">
              <h3>TITLE</h3>
              <div className="sort-icon">{sortIcon(titleSort)}</div>
            </div>
          </div>
          <div
            className="track-item track-item-1-4"
            onClick={() => sort(albumSort, setAlbumSort, "album")}
          >
            <div className="track-header-inner-wrapper">
              <h3>ALBUM</h3>
              <div className="sort-icon">{sortIcon(albumSort)}</div>
            </div>
          </div>
          <div
            className="track-item track-item-1-4"
            onClick={() => sort(artistSort, setArtistSort, "artist")}
          >
            <div className="track-header-inner-wrapper">
              <h3>ARTIST</h3>
              <div className="sort-icon">{sortIcon(artistSort)}</div>
            </div>
          </div>
        </div>
        <div className="track-item"></div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="TRACK">
          {dropProvided => (
            <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
              {state.currentViewingPlaylist.tracks.map((track, index) => (
                <Draggable
                  key={track.url}
                  draggableId={track.url}
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
                      <TrackCard key={track.url} track={track} />
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

export default PlaylistContentView;
