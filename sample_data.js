const getImageData = (ctx, n) => {
    let dataset = [];
    let topLeftPixel = ctx.getImageData(0, 0, 1, 1).data;
    let zeroColor = topLeftPixel[0] + topLeftPixel[1] + topLeftPixel[2];

    // sample color data from n random pixels
    for (let i = 0; i < n; i++) {
      let x1 = Math.floor(Math.random() * 500);
      let x2 = Math.floor(Math.random() * 500);
      let pixelData = ctx.getImageData(x1, x2, 1, 1).data;
      let color = pixelData[0] + pixelData[1] + pixelData[2];
      let group = color == zeroColor ? 0 : 1;
      dataset.push([group, x1, x2]);
    }
    return dataset;
};

document.addEventListener("DOMContentLoaded", () => {
  // create elements
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let image = document.createElement("img");

  // set img source
  let imgSrc = "sample_data1.jpg";
  image.src = imgSrc;

  // define canvas size
  let canvasWidth = 500;
  let canvasHeight = 500;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // on image load, draw image then sample pixel data
  image.addEventListener("load", function () {
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    let dataset = getImageData(ctx, 1000);
  });
});
