const { remote } = window.require("electron");
var fs = window.require("fs");

const fileUtils = {
  async openAudioFiles() {
    const files = await remote.dialog.showOpenDialog({
      title: "Open Files",
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Audio Files", extensions: ["mp3"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });

    if (!files || files.canceled || files.filePaths === 0) {
      return [];
    }
    return files.filePaths;
  },
  async savePlaylist(content) {
    let options = {
      title: "Save playlist",
      defaultPath: "my_playlist",
      buttonLabel: "Save",

      filters: [{ name: "json", extensions: ["json"] }]
    };

    await remote.dialog.showSaveDialog(options).then(result => {
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, JSON.stringify(content), "utf-8");
      }
    });
  },
  async loadPlaylist() {
    const result = await remote.dialog
      .showOpenDialog({
        title: "Open Playlist",
        properties: ["openFile"],
        filters: [
          { name: "json", extensions: ["json"] },
          { name: "All Files", extensions: ["*"] }
        ]
      })
      .then(files => {
        if (!files || files.canceled || files.filePaths === 0) {
          return [];
        }
        return files;
      })
      .then(files => {
        if (files && files.filePaths && files.filePaths.length > 0) {
          return JSON.parse(fs.readFileSync(files.filePaths[0]));
        }
      });

    return result ? result : [];
  }
};

export default fileUtils;