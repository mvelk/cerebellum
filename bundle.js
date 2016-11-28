/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const getImageData = __webpack_require__(1);
	const Model = __webpack_require__(2);
	const Activation = __webpack_require__(4);
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	const getImageData = (ctx, n) => {
	    let dataset = [];
	    let topLeftPixel = ctx.getImageData(0, 0, 1, 1).data;
	    let zeroColor = topLeftPixel[0] + topLeftPixel[1] + topLeftPixel[2];
	
	    // sample color data from n random pixels
	    for (let i = 0; i < n; i++) {
	      let x = Math.floor(Math.random() * 500);
	      let y = Math.floor(Math.random() * 500);
	      let pixelData = ctx.getImageData(x, y, 1, 1).data;
	      let color = pixelData[0] + pixelData[1] + pixelData[2];
	      let group = color == zeroColor ? 0 : 1;
	      dataset.push([x, y, group]);
	    }
	    return dataset;
	};
	
	module.exports = getImageData;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Matrix = __webpack_require__(3);
	
	class Model {
	  constructor(model,data,activationF,learningRate) {
	    this.model = model; // the number of neurons in each layer, counting input and output layers
	    this.length = model.length;
	    this.data = new Matrix(data);
	    this.y = this.data.getCols(0,1);
	    this.x = this.data.getCols(1,this.data.m);
	    this.x = this.x.transpose();
	    this.N = this.data.n; // number of observations
	    this.activationF = activationF;
	    this.learningRate = learningRate;
	
	    this.weightMatrices = this.createWeightMatrices();
	  }
	
	  createWeightMatrices() {
	    let weightMatrices = [];
	    // for each later, we need to map a_n (i elements) to a_n+1 (j elements)
	    // we multiply A_n*a_n = a_n+1, so the matrix A_n is j x i
	    // we add one to a_n i to account for the bias term being added
	    for (var i = 0; i < this.length-1; i++) {
	      weightMatrices.push(Matrix.randomMatrix(this.model[i+1],this.model[i]+1));
	    }
	    return weightMatrices;
	  }
	
	  iterate() {
	    // accumulator for deltas of each layer
	    let accumulator = this.getAccum();
	    let layerValues;
	    // forward and back prop for each observation
	    for (var i = 0; i < this.y.n; i++) {
	      layerValues = this.forwardProp(i);
	      accumulator = this.backProp(accumulator,layerValues,i);
	    }
	    this.incrementWeights(accumulator);
	  }
	
	  // creates array of vectors of 0s matching model with bias
	  getAccum() {
	    let accum = [];
	    let weightMatrix;
	    for (var i = 0; i < this.length-1; i++) {
	      weightMatrix = this.weightMatrices[i];
	      accum.push(Matrix.emptyMatrix(weightMatrix.n,weightMatrix.m));
	    }
	    return accum;
	  }
	
	  // conducts forward prop for observation n, returns all neuron layers as 2D array
	  forwardProp(n) {
	    let layer = this.x.getCols(n,n+1);
	    let layerValues = [layer];
	    let weightMatrix;
	    // calculates each layer
	    for (var i = 0; i < this.length-1; i++) {
	      weightMatrix = this.weightMatrices[i];
	      layer = this.forwardLayer(weightMatrix,layer);
	      layerValues.push(layer);
	    }
	    return layerValues;
	  }
	
	  // a^n = g(A^n-1*(a^n-1 + bias))
	  forwardLayer(weightMatrix,prevLayer) {
	    let prevWithBias = prevLayer.addBias();
	    let product = weightMatrix.multiply(prevWithBias);
	    let nextLayer = product.elementWiseFunction(this.activationF);
	    return nextLayer;
	  }
	
	  backProp(accumulator,layerValues,n) {
	    let currentY = this.y.getRows(n,n+1);
	    // final layer: d^n = a^n - y
	    let d = layerValues[this.length-1].subtract(currentY); // d^i+1
	    let daT = d.multiply(layerValues[this.length-2].addBias().transpose()); // d^i+1 * (a^i)T
	    accumulator[this.length-2] = accumulator[this.length-2].add(daT); // D_ij = D_ij + a_j * d_i
	
	    // other layers: d^n = (A^n)T * d^n+1 * (a^n . (1 - a^n)), stop at input layer
	    let weightMatrix;
	    let layer;
	    for (var i = this.length-2; i > 0; i--) {
	      weightMatrix = this.weightMatrices[i]; // A^n
	      layer = layerValues[i]; // a^n
	      d = this.backLayer(weightMatrix,d,layer); // d^n = backLayer(A^n,d^n+1,a^n)
	      d = d.getRows(1,d.n); // removing the first entry, corresponding to bias of current layer
	      daT = d.multiply(layerValues[i-1].addBias().transpose()); // D_ij = D_ij + a_j * d_i
	      accumulator[i-1] = accumulator[i-1].add(daT); // D_ij = D_ij + a_j * d_i
	    }
	    return accumulator;
	  }
	
	  // other layers: d^n = (A^n)T * d^n+1 * (a^n . (1 - a^n))
	  backLayer(weightMatrix,d,layer) {
	    let dG = layer.dotProduct(Matrix.vector(layer.n,1).subtract(layer)); // (a^n . (1 - a^n))
	    let ATd = weightMatrix.transpose().multiply(d); // (A^n)T * d^n+1
	    return ATd.multiply(dG); // (A^n)T * d^n+1 * (a^n . (1 - a^n))
	  }
	
	  // increments weights according to accumulator
	  incrementWeights(accumulator,layerValues) {
	    let increment;
	    for (var i = 0; i < this.length-1; i++) {
	      increment = accumulator[i].elementWiseFunction(n => this.learningRate*n/this.N);
	      this.weightMatrices[i] = this.weightMatrices[i].subtract(increment);
	    }
	  }
	
	  // used to render fitted graphs
	  // takes in an array of x values [x_1, x_2...], returns layer values
	  modelFunction(data){
	    let layer = [];
	    for (var i = 0; i < data.length; i++) {
	      layer.push([data[i]]);
	    }
	    layer = new Matrix(layer);
	    let layerValues = [layer];
	    let weightMatrix;
	    // calculates each layer
	    for (var i = 0; i < this.length-1; i++) {
	      weightMatrix = this.weightMatrices[i];
	      layer = this.forwardLayer(weightMatrix,layer);
	      layerValues.push(layer);
	    }
	    return layerValues[layerValues.length-1];
	  }
	}
	
	module.exports = Model;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	class Matrix {
	  constructor(array) {
	    this.array = array; // [[1,2,3],[4,5,6]]
	    this.n = array.length;
	    this.m = array[0].length;
	  }
	
	  canMultiply(matrix) {
	    return this.m === matrix.n;
	  }
	
	  multiply(matrix) {
	    if (!this.canMultiply(matrix)) {
	      throw "Can't multiply, incorrect dimensions";
	    }
	
	    let sum;
	    let newMatrix = Matrix.emptyMatrix(this.n,matrix.m);
	    for (var i = 0; i < this.n; i++) {
	      for (var j = 0; j < matrix.m; j++) {
	        sum = 0;
	        for (var k = 0; k < this.m; k++) {
	          sum += this.array[i][k]*matrix.array[k][j];
	        }
	        newMatrix.array[i][j] = sum;
	      }
	    }
	
	    return newMatrix;
	  }
	
	  canArithmetic(matrix) {
	    return this.n === matrix.n && this.m === matrix.m;
	  }
	
	  add(matrix){
	    if (!this.canArithmetic(matrix)) {
	      throw "Can't add, incorrect dimensions";
	    }
	
	    let newMatrix = Matrix.emptyMatrix(this.n,this.m);
	    for (var i = 0; i < this.n; i++) {
	      for (var j = 0; j < this.m; j++) {
	        newMatrix.array[i][j] = this.array[i][j] + matrix.array[i][j];
	      }
	    }
	
	    return newMatrix;
	  }
	
	  subtract(matrix){
	    if (!this.canArithmetic(matrix)) {
	      throw "Can't subtract, incorrect dimensions";
	    }
	
	    let newMatrix = Matrix.emptyMatrix(this.n,this.m);
	    for (var i = 0; i < this.n; i++) {
	      for (var j = 0; j < this.m; j++) {
	        newMatrix.array[i][j] = this.array[i][j] - matrix.array[i][j];
	      }
	    }
	
	    return newMatrix;
	  }
	
	  //same as slice but slices columns
	  getCols(a,b) {
	    let cols = [];
	    for (var i = 0; i < this.n; i++) {
	      cols.push(this.array[i].slice(a,b));
	    }
	    return new Matrix(cols);
	  }
	
	  //same as slice but slices rows
	  getRows(a,b) {
	    if (a < 0 || b > this.n) {
	      throw "Can't get rows, invalid row numbers";
	    }
	    let rows = []
	    for (var i = a; i < b; i++) {
	      rows.push(this.array[i]);
	    }
	    return new Matrix(rows);
	  }
	
	  transpose() {
	    let newMatrix = Matrix.emptyMatrix(this.m,this.n);
	    for (var i = 0; i < this.n; i++) {
	      for (var j = 0; j < this.m; j++) {
	        newMatrix.array[j][i] = this.array[i][j];
	      }
	    }
	    return newMatrix;
	  }
	
	  // calls fn for each element of matrix and returns matrix of new values
	  elementWiseFunction(fn) {
	    let newMatrix = Matrix.emptyMatrix(this.n,this.m);
	    for (var i = 0; i < this.n; i++) {
	      for (var j = 0; j < this.m; j++) {
	        newMatrix.array[i][j] = fn(this.array[i][j]);
	      }
	    }
	    return newMatrix;
	  }
	
	  canDot(matrix) {
	    return this.m === 1 && matrix.m === 1 && this.n === matrix.n;
	  }
	
	  dotProduct(matrix) {
	    if (!this.canDot(matrix)){
	      throw "Can't find dot product, incorrect dimensions";
	    }
	    let sum = 0;
	    for (var i = 0; i < this.n; i++) {
	      sum += this.array[i][0]*matrix.array[i][0];
	    }
	    return new Matrix([[sum]]);
	  }
	
	  // appends a row of 1s to the top of a matrix
	  addBias() {
	    let array = this.array.slice();
	    array.unshift(new Array(this.m).fill(1));
	    return new Matrix(array);
	  }
	
	  // returns 2 array with dim n x m
	  static emptyMatrix(n,m) {
	    let array = new Array(n);
	    for (var i = 0; i < n; i++) {
	      array[i] = new Array(m).fill(0);
	    }
	    return new Matrix(array);
	  }
	
	  // creates identity matrix of dim nxn
	  static identity(n){
	    let array = new Array(n);
	    for (var i = 0; i < n; i++) {
	      array[i] = new Array(n).fill(0);
	    }
	    for (var i = 0; i < n; i++) {
	      array[i][i] = 1;
	    }
	    return new Matrix(array);
	  }
	
	  static vector(n,v){
	    let array = new Array(n).fill([v]);
	    return new Matrix(array);
	  }
	
	  static randomMatrix(n,m) {
	    let array = new Array(n);
	    let row;
	    for (var i = 0; i < n; i++) {
	      row = [];
	      for (var j = 0; j < m; j++) {
	        row.push(Math.random());
	      }
	      array[i] = row;
	    }
	    return new Matrix(array);
	  }
	}
	
	module.exports = Matrix;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Activation = {
	  "sigmoid" : (n) => {
	    return 1/(1+Math.exp(-n))
	  }
	}
	
	module.exports = Activation


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map