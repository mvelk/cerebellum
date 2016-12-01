const d3 = require("d3");
const Model = require("./model.js");

class HeatMap {
  constructor(canvasDim, sampleSize, domainDim, container) {
    this.width = canvasDim;
    this.height = canvasDim;
    this.domain = domainDim;
    this.sampleSize = sampleSize;
    this.container = container;
    this.xScale = d3.scaleLinear().domain([0, this.domain]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, this.domain]).range([0, this.height]);
    this.colorScale = d3.scaleLinear().domain([0, 0.5, 1]).range(['#b39ddb', 'white', '#ffff8d']).clamp(true);
  }

  generate() {
    d3.select("#real-heatmap").style("position", "relative");

    this.canvas = d3.select("#heatmap").append("canvas")
      .attr("width", this.domain)
      .attr("height", this.domain);

    this.realCanvas = d3.select("#real-heatmap").append("canvas")
      .attr("width", this.width)
      .attr("height", this.height);
    this.context = this.canvas.node().getContext("2d");
    this.realContext = this.realCanvas.node().getContext("2d");
    this.realContext.scale(this.width / this.domain, this.height / this.domain);
    this.image = this.context.createImageData(this.domain, this.domain);

    let container = d3.select("#real-heatmap");
    this.scatterPlot = container.append("svg");
    this.scatterPlot.attr("width", this.width)
      .attr("height", this.height)
      .style("position", "absolute")
      .style("left", "0")
      .style("top", "0");
    window.scatterPlot = this.scatterPlot;


  }

  updateScatter() {

  }

  paintGradient(model) {
    let context = this.context;
    let realContext = this.realContext;
    let image = this.image;
    let canvas = this.canvas;
    let p = 0;
    for (let x1 = 0; x1 < this.domain; x1++) {
      for (let x2 = 0; x2 < this.domain; x2++) {
        let value = model.modelFunction([(x2-(this.domain/2))/(this.domain/2), (x1-(this.domain/2))/(this.domain/2)]);
        let color = d3.rgb(this.colorScale(value));
        image.data[p++] = color.r;
        image.data[p++] = color.g;
        image.data[p++] = color.b;
        image.data[p++] = 255;
      }
    }
    context.putImageData(image, 0, 0);
    realContext.drawImage(context.canvas, 0, 0);
  }
}

module.exports = HeatMap;
