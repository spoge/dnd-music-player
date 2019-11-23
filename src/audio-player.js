const { dialog } = require("electron").remote;
const fs = require("fs");

const convertSong = filePath => {
  const songPromise = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(dataurl.convert({ data, mimetype: "audio/mp3" }));
    });
  });
  return songPromise;
};

const openFile = (exports.openFile = () => {
  const files = dialog.showOpenDialog({
    title: "Open File",
    properties: ["openFile"],
    filters: [{ name: "Audio Files", extensions: ["mp3"] }]
  });

  if (!files) {
    return;
  }

  const filePath = files[0];
  return createSongObject(filePath);
});

const createSongObject = filePath => {
  const track = {};
  return getDuration(filePath)
    .then(duration => Object.assign(track, { duration, filePath }))
    .then(track => getTags(track));
};

export default openFile;
