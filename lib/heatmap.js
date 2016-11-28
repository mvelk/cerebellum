const d3 = require("d3");
const Model = require("./model.js");

class HeatMap {
  constructor(model, width, sampleSize, domain, container) {
  this.model = model;
  this.width = [0, width];
  this.height = [0, width];
  this.domain = domain;
  this.sampleSize = sampleSize;
  this.container = container;
  this.xScale = d3.scaleLinear().domain(this.domain).range(this.width);
  this.yScale = d3.scaleLinear().domain(this.domain).range(this.height);
  this.colorScale = d3.scaleLinear().domain([0, 0.5, 1]).range(['palegreen', 'lavendar', 'salmon']).clamp(true);
  }
  generate() {
    this.heatMapContainer = this.container.append("div")
      .style({
        width: `${this.width}px`,
        height: `${this.height}px`,
        });
    this.canvas = this.heatMapContainer.append("canvas")
      .attr("width", this.domain[1])
      .attr("height", this.domain[1])
      .style("width", this.width)
      .style("height", this.height);
  }
  paintGradient() {
    let context = this.canvas.getContext("2d");
    let image = context.createImageData(this.domain[1], this.domain[1]);
    let p = 0;
    for (let x1 = 0; x1 < this.domain[1]; x1++) {
      for (let x2 = 0; x2 < this.domain[1]; x2++) {
        let value = this.model.modelFunction([x1, x2]);
        let color = d3.rgb(this.colorScale);
        image.data[p++] = color.r;
        image.data[p++] = color.g;
        image.data[p++] = color.b;
        image.data[p++] = 255;
      }
    }
    context.putImageData(image, 0, 0);
  }

}
