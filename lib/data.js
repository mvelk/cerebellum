const getImageData = (ctx, n, xdim, ydim) => {
    let dataset = [];
    let topLeftPixel = ctx.getImageData(0, 0, 1, 1).data;
    let zeroColor = topLeftPixel[0] + topLeftPixel[1] + topLeftPixel[2];

    // sample color data from n random pixels
    for (let i = 0; i < n; i++) {
      let x = Math.floor(Math.random() * xdim);
      let y = Math.floor(Math.random() * ydim);
      let pixelData = ctx.getImageData(x, y, 1, 1).data;
      let color = pixelData[0] + pixelData[1] + pixelData[2];
      let group = color == zeroColor ? 0 : 1;
      dataset.push([group, (x-(xdim/2))/(xdim/2), (y-(ydim/2))/(ydim/2)]);
    }
    return dataset;
};

module.exports = getImageData;
