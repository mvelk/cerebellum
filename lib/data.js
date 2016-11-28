const getImageData = (ctx, n) => {
    let dataset = [];
    let topLeftPixel = ctx.getImageData(0, 0, 1, 1).data;
    let zeroColor = topLeftPixel[0] + topLeftPixel[1] + topLeftPixel[2];

    // sample color data from n random pixels
    for (let i = 0; i < n; i++) {
      let x = Math.floor(Math.random() * 500);
      let y = Math.floor(Math.random() * 500);
      let pixelData = ctx.getImageData(x, y, 1, 1).data;
      let color = pixelData[0] + pixelData[1] + pixelData[2];
      let group = color == zeroColor ? 0 : 1;
      dataset.push([x, y, group]);
    }
    return dataset;
};

module.exports = getImageData;
