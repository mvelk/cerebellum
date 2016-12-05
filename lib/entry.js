const getImageData = require("./data");
const Model = require("./model");
const Activation = require("./activation");
const d3 = require("d3");
const HeatMap = require("./heatmap");
const sankeyDiagram = require('d3-sankey-diagram');


document.addEventListener("DOMContentLoaded", () => {
  // adjustable settings
  let sampleSize = 250;
  let maxLayers = 5;
  let maxNeurons = 6;
  let numLayers = 2;
  let neuralNet = [2,4,2,1];
  let inputDim = 300;
  let outputDim = 50;

  let canvas = document.getElementById("data-sampler");
  let ctx = canvas.getContext("2d");
  let learningRateEl = document.getElementById("learning-rate");
  let iterationsEl = document.getElementById("iterations");
  let activationFEl = document.getElementById("activation-function");
  let playButton = document.getElementById("play-button");
  let incrementButton = document.getElementById("increment-button");
  let resetButton = document.getElementById("reset-button");
  let dataGallery = document.getElementById("data-thumb-gallery");
  let addLayerButton = document.getElementById("add-layer-button");
  let removeLayerButton = document.getElementById("remove-layer-button");
  let layerCount = document.getElementById("layer-count")
  // get elements for each layer
  let layerNeuron = {}
  for (var i = 1; i <= 5; i++) {
    layerNeuron[i] = {
      div: document.getElementById(`neuron-buttons-${i}`),
      addButton: document.getElementById(`add-neuron-button-${i}`),
      removeButton: document.getElementById(`remove-neuron-button-${i}`),
      counter: document.getElementById(`neuron-count-${i}`),
      neuronCount: parseInt(document.getElementById(`neuron-count-${i}`).innerHTML)
    }
  }

  // define input image size
  canvas.width = inputDim;
  canvas.height = inputDim;

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

  const reset = () => {
    // creates sample data
    ctx.drawImage(image, 0, 0, inputDim, inputDim);
    dataset = getImageData(ctx, sampleSize, inputDim, inputDim);
    // creates model
    model = new Model(neuralNet, dataset, dataset, activationF, learningRate);
    window.model = model
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

  const play = () => {
    interval = window.setInterval(increment, 10);
  };

  const stop = () => {
    interval = window.clearInterval(interval);
  };

  // creates array of neuron count
  const getNeuralNet = () => {
    let newModel = [2];
    let layer;
    for (var i = 1; i <= numLayers; i++) {
      newModel.push(layerNeuron[i].neuronCount);
    }
    newModel.push(1);
    return newModel;
  };

  // sets classes for neuron buttons' divs
  const setLayerVisibility = () => {
    for (var i = 1; i <= numLayers; i++) {
      layerNeuron[i].div.className = "show";
    }
    for (var i = numLayers+1; i <= maxLayers; i++) {
      layerNeuron[i].div.className = "hide";
    }
  };

  const setAddNeuron = (i) => {
    return () => {
      if (layerNeuron[i].neuronCount + 1 <= maxNeurons) {
        layerNeuron[i].neuronCount += 1;
        neuralNet = getNeuralNet();
        reset();
      }
    }
  }

  const setRemoveNeuron = (i) => {
    return () => {
      if (layerNeuron[i].neuronCount - 1 >= 1) {
        layerNeuron[i].neuronCount -= 1;
        neuralNet = getNeuralNet();
        reset();
      }
    }
  }

  //swaps out dataset image and resets network
  dataGallery.addEventListener("click", (e) => {
    let newImageUrl = e.target.getAttribute("data-image-url");
    image.src = newImageUrl;
    e.stopPropagation();
  });

  playButton.addEventListener("click",(e)=>{
    e.preventDefault();
    let icon = document.getElementById('play-pause');
    if (icon.classList[1] == "fa-play") {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
    } else {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
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

  addLayerButton.addEventListener("click",(e)=>{
    if (numLayers+1 <= maxLayers) {
      numLayers += 1;
      neuralNet = getNeuralNet();
      setLayerVisibility();
      reset();
    }
  });

  removeLayerButton.addEventListener("click",(e)=>{
    if (numLayers-1 >= 0) {
      numLayers -= 1;
      neuralNet = getNeuralNet();
      setLayerVisibility();
      reset();
    }
  });

  learningRateEl.addEventListener("change",(e)=>{
    learningRate = e.currentTarget.value;
    reset();
  });

  activationFEl.addEventListener("change",(e)=>{
    activationF = e.currentTarget.value;
    reset();
  });

  // on image load, initialize model and add listeners
  image.addEventListener("load", function () {
    reset();
  });

  // sets listeners for each add/remove neuron button
  for (var i = 1; i <= maxLayers; i++) {
    layerNeuron[i].addButton.addEventListener("click",setAddNeuron(i))
    layerNeuron[i].removeButton.addEventListener("click",setRemoveNeuron(i))
  }
});
