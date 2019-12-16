import React from "react";
import Dropzone from "react-dropzone";

import "./PlaylistPage.scss";
import fileUtils from "../utils/file-util";

import PlaylistPage from "./PlaylistPage";

const DroppableMenuPlaylist = ({ loadTracks, loadPlaylists }) => {
  const loadPlaylistsFromJson = async filePaths => {
    const newPlaylists = await fileUtils.loadPlaylistsFromJson(filePaths);
    loadPlaylists(newPlaylists);
  };

  const onDrop = acceptedFiles => {
    let mp3Array = [];
    let playlistArray = [];
    acceptedFiles
      .map(file => file.path)
      .forEach(filePath => {
        if (filePath.endsWith(".mp3")) {
          mp3Array.push(filePath);
        } else if (filePath.endsWith(".json")) {
          playlistArray.push(filePath);
        } else {
          console.warn("Couldn't load " + filePath);
        }
      });

    loadTracks(mp3Array);
    loadPlaylistsFromJson(playlistArray);
  };

  return (
    <Dropzone onDrop={onDrop} noClick>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({
            style: {
              outline: "none"
            }
          })}
        >
          <input {...getInputProps()} />
          <PlaylistPage />
        </div>
      )}
    </Dropzone>
  );
};

export default DroppableMenuPlaylist;
