const convertToPhotoUrl = name => `images/${name.toLowerCase().replace(/\s/gi, '-')}.jpg`;

module.exports = {
  convertToPhotoUrl,
};
