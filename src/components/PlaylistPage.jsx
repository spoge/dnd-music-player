import React from "react";

import "./PlaylistPage.scss";

import PlaylistMenuView from "./PlaylistMenu/PlaylistMenuView";
import PlaylistContentView from "./PlaylistContent/PlaylistContentView";

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
      </div>
    </div>
  );
};

export default PlaylistPage;
