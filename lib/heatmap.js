const d3 = require("d3");
const Model = require("./model.js");

class HeatMap {
  constructor(model, width, sampleSize, domain, container) {
  this.model = model;
  this.width = [0, width];
  this.height = [0, width];
  this.sampleSize = sampleSize;
  this.domain = domain;
  this.container = container;
  }
  generate() {
    this.heatMapContainer = this.container.append("div")
      .style({
        width: `${this.width}px`,
        height: `${this.height}px`,
        });
    this.canvas = this.heatMapContainer.append("canvas")
      .attr("width", this.sampleSize)
      .attr("height", this.sampleSize)
      .style("width", this.width)
      .style("height", this.height);
  }
  paintGradient() {
    for (let x = 0; x < domain[1]; x++) {
      for (let y = 0; y < domain[1]; y++) {
        let value = this.model.modelFunction([x, y]);
        
      }
    }

  }

}


let container = container;
let canvas = canvas;
let svg = svg;
let domain = [0, 500];
let width, height = [[0, 250], [0, 250]];
let xScale = d3.scaleLinear().domain(domain).range([0, width]);
let yScale = d3.scaleLinear().domain(domain).range([0, height]);
let colorScale = d3.scaleLinear().domain([0, 0.5, 1]).range(['palegreen', 'lavendar', 'salmon']).clamp(true);
