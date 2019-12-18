import React from "react";

import "./PlaylistPage.scss";

import PlaylistInputsView from "./Input/PlaylistInputsView";
import PlaylistMenuView from "./PlaylistMenu/PlaylistMenuView";
import PlaylistContentView from "./PlaylistContent/PlaylistContentView";
import PlaylistPlayer from "./PlaylistPlayer/PlaylistPlayer";

const PlaylistPage = () => {
  return (
    <div className="playlist-page">
      <div className="playlist-wrapper">
        <div className="playlist-contents-wrapper">
          <div className="playlist-menu-wrapper size-1-4">
            <PlaylistMenuView />
          </div>
          <div className="playlist-content-wrapper size-3-4">
            <PlaylistContentView />
          </div>
        </div>
        <div className="input-checkbox-wrapper">
          <PlaylistInputsView />
        </div>
      </div>

      <div className="player-wrapper">
        <PlaylistPlayer />
      </div>
    </div>
  );
};

export default PlaylistPage;
