const getImageData = (ctx, n, dim) => {
    let dataset = [];
    let topLeftPixel = ctx.getImageData(0, 0, 1, 1).data;
    let zeroColor = topLeftPixel[0] + topLeftPixel[1] + topLeftPixel[2];

    // sample color data from n random pixels
    for (let i = 0; i < n; i++) {
      let x = Math.floor(Math.random() * dim);
      let y = Math.floor(Math.random() * dim);
      let pixelData = ctx.getImageData(x, y, 1, 1).data;
      let color = pixelData[0] + pixelData[1] + pixelData[2];
      let group = color == zeroColor ? 0 : 1;
      dataset.push([group, (x-(dim/2))/(dim/2), (y-(dim/2))/(dim/2)]);
    }
    return dataset;
};

module.exports = getImageData;
