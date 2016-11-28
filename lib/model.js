"use strict";
const Matrix = require("./matrix");
const Activation = require("./activation");

class Model {
  constructor(model,data,testData,activationF,learningRate) {
    this.model = model; // the number of neurons in each layer, counting input and output layers
    this.length = model.length;
    this.activationF = Activation[activationF];
    this.lossF = Activation[activationF+" loss"];
    this.learningRate = learningRate;

    // training data
    this.data = new Matrix(data);
    this.y = this.data.getCols(0,1);
    this.x = this.data.getCols(1,this.data.m);
    this.x = this.x.transpose(); // 1 observation per column
    this.N = this.data.n; // number of observations

    // test data
    this.testData = new Matrix(testData);
    this.testY = this.testData.getCols(0,1);
    this.testX = this.testData.getCols(1,this.testData.m);
    this.testX = this.testX.transpose();
    this.testN = this.testData.n;

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

  calculateLoss(type){
    let x;
    let y;
    let N;
    if (type === "training"){
      x = this.x;
      y = this.y;
      N = this.N;
    } else {
      x = this.testX;
      y = this.testY;
      N = this.testN;
    }

    let sumLoss = 0;
    let yVal;
    let xVal;
    let yHat;
    for (var i = 0; i < N; i++) {
      yVal = y.getRows(i,i+1).array[0][0];
      xVal = x.getCols(i,i+1).transpose().array[0];
      yHat = this.modelFunction(xVal).array[0][0];
      sumLoss += this.lossF(yVal, yHat);
    }
    sumLoss /= N;
    return sumLoss;
  }
}

module.exports = Model;
