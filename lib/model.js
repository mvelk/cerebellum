"use strict";
const Matrix = require("./matrix");
const Activation = require("./activation");

class Model {
  constructor(model,data,testData,activationF,learningRate) {
    this.model = model; // the number of neurons in each layer, counting input and output layers
    this.length = model.length;

    // functions contingent on activation function
    this.functions = Activation[activationF];
    this.activationF = this.functions["activation"];
    this.derivativeF = this.functions["derivative"];
    this.inputF = this.functions["input"]; // some activation functions require morphing of data
    this.outputF = this.functions["output"];
    this.lossF = Activation["loss"];
    this.learningRate = learningRate;

    // training data
    this.data = new Matrix(data);
    this.y = this.data.getCols(0,1);
    this.y = this.y.elementWiseFunction(this.inputF);
    this.x = this.data.getCols(1,this.data.m);
    this.x = this.x.transpose(); // 1 observation per column
    this.N = this.data.n; // number of observations
    // test data
    this.testData = new Matrix(testData);
    this.testY = this.testData.getCols(0,1);
    this.testY = this.testY.elementWiseFunction(this.inputF);
    this.testX = this.testData.getCols(1,this.testData.m);
    this.testX = this.testX.transpose();
    this.testN = this.testData.n;

    this.weightMatrices = this.createWeightMatrices();
  }

  // Creates weight matrices according to each neuron layer
  createWeightMatrices() {
    let weightMatrices = [];
    // for each later, we need to map a_n (i elements) to a_n+1 (j elements)
    // we multiply A_n*a_n = a_n+1, so the matrix A_n is j x i
    // we add one row to a_n to account for the bias term being added
    for (var i = 0; i < this.length-1; i++) {
      weightMatrices.push(Matrix.randomMatrix(this.model[i+1],this.model[i]+1));
    }
    return weightMatrices;
  }

  // runs forward, back propagation, and increments weights matrices
  iterate() {
    // accumulator for deltas of each layer
    let accumulator = this.getAccum();
    let layerValues;

    // forward and back prop for each observation
    for (var i = 0; i < this.y.n; i++) {
      layerValues = this.forwardProp(i); // calculates and stores neuron layer values in array
      accumulator = this.backProp(accumulator,layerValues,i); // calculates adjustments to be made to weight matrix
    }
    this.incrementWeights(accumulator);
  }

  // creates matrices of 0s matching dimensions of weight matrices
  getAccum() {
    let accum = [];
    let weightMatrix;
    for (var i = 0; i < this.length-1; i++) {
      weightMatrix = this.weightMatrices[i];
      accum.push(Matrix.emptyMatrix(weightMatrix.n,weightMatrix.m));
    }
    return accum;
  }

  // conducts forward prop for observation n, returns all neuron layers as an array containing column matrices
  forwardProp(n) {
    let layer = this.x.getCols(n,n+1);
    let layerValues = [layer]; // inputs are the first neuron layer
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
    let prevWithBias = prevLayer.addBias(); // adds a row of 1 to the top of vector
    let product = weightMatrix.multiply(prevWithBias);
    let nextLayer = product.elementWiseFunction(this.activationF);
    return nextLayer;
  }

  backProp(accumulator,layerValues,n) {
    let currentY = this.y.getRows(n,n+1);
    let d = layerValues[this.length-1].subtract(currentY); // d^i+1
    let daT = d.multiply(layerValues[this.length-2].addBias().transpose()); // d^i+1 * (a^i)T
    accumulator[this.length-2] = accumulator[this.length-2].add(daT); // D_ij = D_ij + a_j * d_i

    // other layers: d^n = (A^n)T * d^n+1 * (a^n . (1 - a^n)), stop at input layer
    let weightMatrix;
    let layer;
    for (var i = this.length-2; i > 0; i--) {
      weightMatrix = this.weightMatrices[i]; // A^n
      layer = layerValues[i]; // a^n
      layer = layer.addBias();
      d = this.backLayer(weightMatrix,d,layer); // d^n = backLayer(A^n,d^n+1,a^n)
      d = d.getRows(1,d.n); // removing the first entry, corresponding to bias of current layer
      daT = d.multiply(layerValues[i-1].addBias().transpose()); // D_ij = D_ij + a_j * d_i
      accumulator[i-1] = accumulator[i-1].add(daT); // D_ij = D_ij + a_j * d_i
    }
    return accumulator;
  }

  // other layers: d^n = (A^n)T * d^n+1 .* g'(a^n),
  // where .* is a row wise multiplication, and g'(a^n) = (a^n .* (1 - a^n)) for sigmoid
  backLayer(weightMatrix,d,layer) {
    let dG = layer.elementWiseFunction(this.derivativeF); // g'(a^n)
    let ATd = weightMatrix.transpose().multiply(d); // (A^n)T * d^n+1
    let newD = ATd.rowWiseMultiply(dG); // (A^n)T * d^n+1 .* g'(a^n)
    return newD;
  }

  // increments weights according to accumulator
  incrementWeights(accumulator,layerValues) {
    let increment;
    for (var i = 0; i < this.length-1; i++) {
      increment = accumulator[i].elementWiseFunction(x => this.learningRate*x/this.N);
      this.weightMatrices[i] = this.weightMatrices[i].subtract(increment);
    }
  }

  // used to render fitted graphs
  // takes in an array of x values [x_1, x_2...], returns fitted y
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

    // returns fitted y estimate
    return this.outputF(layerValues[this.length-1].array[0][0]);
  }

  calculateLoss(type){
    let x, y, N, yVal, xVal, yHat;
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
    for (var i = 0; i < N; i++) {
      yVal = y.getRows(i,i+1).array[0][0];
      xVal = x.getCols(i,i+1).transpose().array[0];
      yHat = this.modelFunction(xVal)
      sumLoss += this.lossF(yVal, yHat);
    }
    sumLoss /= N;
    return sumLoss;
  }

  getSankeyData(){
    let nodes = [];
    for (var i = 0; i < this.length; i++) {
      // adds bias neuron node
      if (i != this.length){
        nodes.push({"id":`${i+1}:0`})
      }
      // adds one node for each neuron
      for (var j = 0; j < this.model[i]; j++) {
        nodes.push({"id":`${i+1}:${j+1}`})
      }
    }
    let currentMatrix, color;
    let links = [];
    for (var k = 0; k < this.weightMatrices.length; k++) {
      currentMatrix = this.weightMatrices[k]
      for (var i = 0; i < currentMatrix.n; i++) {
        for (var j = 0; j < currentMatrix.m; j++) {
          color = currentMatrix.array[i][j] < 0 ? "salmon" : "palegreen"
          links.push({
            "source": `${k+1}:${j}`,
            "target": `${k+2}:${i+1}`,
            "value": Math.abs(currentMatrix.array[i][j]),
            "color": color
          })
        }
      }
    }
    return {"nodes":nodes, "links":links}
  }
}


module.exports = Model;
