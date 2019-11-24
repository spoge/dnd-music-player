const remote = window.require("electron").remote;

const fileUtils = {
  async openFiles() {
    const files = await remote.dialog.showOpenDialog({
      title: "Open Files",
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Audio Files", extensions: ["mp3"] }]
    });

    if (!files || files.canceled || files.filePaths === 0) {
      return [];
    }
    return files.filePaths;
  }
};

export default fileUtils;
