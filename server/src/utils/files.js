const fs = require('fs');
const path = require('path');

function deletePosterFile(posterPath) {
  if (!posterPath) return;
  const absolute = path.join(__dirname, '../../', posterPath.replace(/^\//, ''));
  if (fs.existsSync(absolute)) {
    try {
      fs.unlinkSync(absolute);
    } catch {
      // ignore missing/locked files
    }
  }
}

function toPublicPosterPath(filename) {
  if (!filename) return null;
  return `uploads/posters/${filename}`;
}

module.exports = { deletePosterFile, toPublicPosterPath };
