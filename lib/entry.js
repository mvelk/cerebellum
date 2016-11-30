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
  image.style.width = "250px";
  image.style.height = "auto";
  let sampleSize = 250;

  // set img source
  let imgSrc = "../images/sample_data2.jpg";
  image.src = imgSrc;

  // define canvas size
  let canvasDim = 200;
  canvas.width = canvasDim;
  canvas.height = canvasDim;

  // define domain size
  let domainDim = 100;

  // set play variables
  let interval = undefined;
  let iterations = 0;

  // on image load, draw image then sample pixel data
  image.addEventListener("load", function () {
    ctx.drawImage(image, 0, 0, canvasDim, canvasDim);
    let dataset = getImageData(ctx, sampleSize, canvasDim, canvasDim);
    let model = new Model([2,4,2,1], dataset, dataset, "tanh", 0.1);
    window.model = model;
    console.log(dataset);

    let diagram = sankeyDiagram()
      .width(1400)
      .height(600)
      .margins({ left: 40, right: 60, top: 10, bottom: 10 })
      .nodeTitle(function(d) { return d.data.title !== undefined ? d.data.title : d.id; })
      .linkTypeTitle(function(d) { return d.data.title; })
      .linkColor(function(d) { return d.data.color; });

    let data = model.getSankeyData();
    d3.select('#sankey')
      .datum(data)
      .call(diagram);

    let heatMap = new HeatMap(canvasDim, sampleSize, domainDim, d3.select("#heatmap"));
    heatMap.generate();
    heatMap.paintGradient(model);

    const play = () => {
      interval = window.setInterval(increment, 1)
    }

    const increment = () => {
      model.iterate();
      iterations ++;
      if (iterations % 10 === 0){
        data = model.getSankeyData();
        d3.select('#sankey')
        .datum(data)
        .call(diagram);

        heatMap.paintGradient(model);
      }
    }

    const stop = () => {
      window.removeInterval(interval);
    }

    play()


  });



});
