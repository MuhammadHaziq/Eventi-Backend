const fs = require("fs-extra");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function uploadImages(files, folder) {
  var images = [];
  let pciturePath = `./uploads/${folder}/`;

  try {
    if (!fs.existsSync(pciturePath)) {
      fs.mkdirSync(pciturePath, {
        recursive: true,
      });
    }
    //getting time & date
    var today = new Date();
    var date =
      today.getFullYear() +
      "_" +
      (today.getMonth() + 1) +
      "_" +
      today.getDate();
    var time =
      today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
    var dateTime = date + "_" + time;

    if (typeof files.name == "undefined" && files.length > 0) {
      //for multi file upload.
      await asyncForEach(files, async (file, index) => {
        let fileType = file.mimetype.split("/")[1];
        fileType = fileType == "octet-stream" ? "jpg" : fileType;

        let newName =
          String.fromCharCode(index + 65) +
          "_" +
          dateTime +
          Math.floor(Math.random() * 1000000000) +
          "." +
          fileType;
        let imageFile = pciturePath + newName;
        fs.writeFileSync(imageFile, file.data);
        images.push(newName);
      });
    } else if (typeof files.name !== "undefined") {
      //fore single file upload
      let fileType = files.mimetype.split("/")[1];
      fileType = fileType == "octet-stream" ? "jpg" : fileType;

      let newName =
        String.fromCharCode(0 + 65) +
        "_" +
        dateTime +
        Math.floor(Math.random() * 1000000000) +
        "." +
        fileType;

      let imageFile = pciturePath + newName;

      fs.writeFileSync(imageFile, files.data);
      images.push(newName);
    }
    return {
      success: true,
      images: images,
      message: "Successfully saved images!",
    };
  } catch (error) {
    return { success: false, images: images, message: error.message };
  }
}
module.exports = { uploadImages };
