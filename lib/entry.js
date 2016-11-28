const getImageData = require("./data.js");
const Model = require("./model.js");
const Activation = require("./activation");

document.addEventListener("DOMContentLoaded", () => {
  // create elements

  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let image = document.createElement("img");

  // set img source
  let imgSrc = "../images/sample_data1.jpg";
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
    let model = new Model([2,2,1], dataset, Activation["sigmoid"], 0.3);
    model.iterate();
    window.model = model;
  });

});
