const getImageData = require("./data");
const Model = require("./model");
const Activation = require("./activation");
const d3 = require("d3");
const HeatMap = require("./heatmap");
const sankeyDiagram = require('d3-sankey-diagram');


document.addEventListener("DOMContentLoaded", () => {

  let canvas = document.getElementById("data-sampler");
  let ctx = canvas.getContext("2d");
  let learningRateEl = document.getElementById("learning-rate");
  let iterationsEl = document.getElementById("iterations");
  let activationFEl = document.getElementById("activation-function");
  // let addLayerButton = document.getElementById("");
  // let removeLayerButton = document.getElementById("");
  let playButton = document.getElementById("play-button");
  let incrementButton = document.getElementById("increment-button");
  let resetButton = document.getElementById("reset-button");
  let dataGallery = document.getElementById("data-thumb-gallery");
  // define input size
  let inputDim = 300;
  canvas.width = inputDim;
  canvas.height = inputDim;

  // define output size
  let outputDim = 50;

  // set img source
  let image = document.createElement("img");
  image.style.width = "250px";
  image.style.height = "auto";
  image.id = "data-image"
  let imgSrc = "images/sample_data1.jpg";
  image.src = imgSrc;

  // set model variables
  let dataset, model, data;
  let interval = undefined;
  let sampleSize = 250;
  let neuralNet = [2,4,2,1];
  let learningRate = learningRateEl.value;
  let iterations = 0;
  let activationF = activationFEl.value;

  // initialize diagrams
  let diagram = sankeyDiagram()
    .width(800)
    .height(500)
    .margins({ left: 40, right: 0, top: 0, bottom: 0 })
    .nodeTitle(function(d) { return d.data.title !== undefined ? d.data.title : d.id; })
    .linkTypeTitle(function(d) { return d.data.title; })
    .linkColor(function(d) { return d.data.color; })
    .linkOpacity(0.7);
  let heatMap = new HeatMap(inputDim, sampleSize, outputDim, d3.select("#heatmap"));
  heatMap.generate();
  window.image = image;

  // on image load, initialize model and add listeners
  image.addEventListener("load", function () {

    const reset = () => {
      // creates sample data
      ctx.drawImage(image, 0, 0, inputDim, inputDim);
      dataset = getImageData(ctx, sampleSize, inputDim, inputDim);
      // creates model
      model = new Model(neuralNet, dataset, dataset, activationF, learningRate);
      iterations = 0;
      iterationsEl.textContent = iterations;
      render();
    };

    const render = () => {
      // update sankey links
      data = model.getSankeyData();
      d3.select('#sankey').datum(data).call(diagram);
      // update heatmap
      heatMap.paintGradient(model);
    };

    const increment = () => {
      model.iterate();
      iterations ++;
      iterationsEl.textContent = iterations;
      if (iterations % 10 === 0){
        render();
      }
    };

    //controls
    const play = () => {
      interval = window.setInterval(increment, 10);
    };

    const stop = () => {
      interval = window.clearInterval(interval);
    };

    //swaps out dataset image and resets network
    dataGallery.addEventListener("click", (e) => {
      let newImageUrl = e.target.getAttribute("data-image-url");
      image.src = newImageUrl;
      reset();
      e.stopPropagation()
    });


    playButton.addEventListener("click",(e)=>{
      console.log("clicked");
      e.preventDefault();
      let icon = document.getElementById('play-pause');
      if (icon.classList[1] == "fa-play") {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
      } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      }
      console.log(interval);
      if (interval === undefined) {
        play();
      } else {
        stop();
      }
    });

    resetButton.addEventListener("click",(e)=>{
      reset();
    });

    incrementButton.addEventListener("click",(e)=>{
      model.iterate();
      iterations ++;
      iterationsEl.textContent = iterations+"";
      render();
    });

    learningRateEl.addEventListener("change",(e)=>{
      learningRate = e.currentTarget.value;
      reset();
    });

    activationFEl.addEventListener("change",(e)=>{
      activationF = e.currentTarget.value;
      reset();
    });


    reset();
  });



});
