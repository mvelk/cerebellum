const getImageData = require("./data");
const Model = require("./model");
const Activation = require("./activation");
const d3 = require("d3");
const HeatMap = require("./heatmap");



document.addEventListener("DOMContentLoaded", () => {
  // create elements

  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let image = document.createElement("img");
  image.style.width = "250px";
  image.style.height = "auto";

  // set img source
  let imgSrc = "../images/sample_data1.jpg";
  image.src = imgSrc;

  // define canvas size
  let canvasWidth = 250;
  let canvasHeight = 250;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // on image load, draw image then sample pixel data
  image.addEventListener("load", function () {
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    let dataset = getImageData(ctx, 1000);
    let model = new Model([2,2,1], dataset, dataset, "sigmoid", 0.3);
    model.iterate();
    window.model = model;

    let heatMap = new HeatMap(model, 250, 250, [0, 250], d3.select("#heatmap"));
    heatMap.generate();
    heatMap.paintGradient();
  });


});
