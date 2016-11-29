const getImageData = require("./data");
const Model = require("./model");
const Activation = require("./activation");
const d3 = require("d3");
const HeatMap = require("./heatmap");
const sankeyDiagram = require('d3-sankey-diagram');


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
    let dataset = getImageData(ctx, 100);
    console.log(dataset);
    let model = new Model([2,3,1], dataset, dataset, "sigmoid", 0.3);
    model.iterate();
    window.model = model;

    // let heatMap = new HeatMap(model, 500, 500, [0, 500], d3.select("#resultViz"));
    // heatMap.generate();
    // heatMap.paintGradient();
    // console.log(heatMap);
    let diagram = sankeyDiagram()
    .width(1000)
    .height(600)
    .margins({ left: 100, right: 160, top: 10, bottom: 10 })
    .nodeTitle(function(d) { return d.data.title !== undefined ? d.data.title : d.id; })
    .linkTypeTitle(function(d) { return d.data.title; })
    .linkColor(function(d) { return d.data.color; });
    let data = model.getSankeyData();
    d3.select('#sankey')
    .datum(data)
    .call(diagram);
    console.log(model.weightMatrices);

    // for (var i = 0; i < 400; i++) {
    //   model.iterate();
    // }
    //
    // data = model.getSankeyData();
    // d3.select('#sankey')
    // .datum(data)
    // .call(diagram);
    // console.log(model.weightMatrices);

  });


});
