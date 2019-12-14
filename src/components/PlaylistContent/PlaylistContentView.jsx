import React, { useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import "./PlaylistContentView.scss";

import TrackCard from "./TrackCard";

import { Store } from "../../Store.js";
import listUtils from "../../utils/list-util";

const PlaylistContentView = () => {
  const globalState = useContext(Store);
  const { state, dispatch } = globalState;

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

    dispatch({ type: "REORDER_CURRENT_PLAYLIST", payload: items });
    dispatch({ type: "SAVE_GLOBAL_STATE" });
  };

  return (
    <div className="track-list">
      <div className="track-header">
        <div className="track-meta-wrapper">
          <div className="track-item track-item-1-2">
            <h3>TITLE</h3>
          </div>
          <div className="track-item track-item-1-4">
            <h3>ALBUM</h3>
          </div>
          <div className="track-item track-item-1-4">
            <h3>ARTIST</h3>
          </div>
        </div>
        <div className="track-item"></div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
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
