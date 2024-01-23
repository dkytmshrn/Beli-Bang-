const ImageKit = require("imagekit");
const createError = require("http-errors");

// const imageKit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

module.exports = function (req, res, next) {
  if (req.file) {
    const data64 = req.file.buffer.toString("base64");

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    imagekit
      .upload({
        file: data64, //required
        fileName: req.file.originalname, //required
      })
      .then((response) => {
        req.body.imgUrl = response.url;
        next();
    })
    .catch((error) => {
        next(createError(500, error.message));
      });
  } else {
    const message = "Image must be provided";
    next(createError(400, message));
  }
};
