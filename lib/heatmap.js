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
    this.colorScale = d3.scaleLinear().domain([0, 0.5, 1]).range(['palegreen', 'white', 'salmon']).clamp(true);
  }

  generate() {
    window.container = this.container;
    this.container.append("div").style(
      {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    );
    this.canvas = d3.select("#heatmap").selectAll("div").append("canvas")
      .attr("width", this.domain)
      .attr("height", this.domain)
      // .style("width", this.width[1])
      // .style("height", this.height[1]);

    this.context = this.canvas.node().getContext("2d");
    this.image = this.context.createImageData(this.domain, this.domain);
  }

  paintGradient(model) {
    let context = this.context;
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
    //
    // var imageObject=new Image();
    // imageObject.onload=function(){
    //
    //   context.clearRect(0,0,canvas.width,canvas.height);
    //   context.scale(2,2);
    //   context.drawImage(imageObject,0,0);
    //
    // }
    // imageObject.src=canvas.toDataURL();
  }
}

module.exports = HeatMap;
