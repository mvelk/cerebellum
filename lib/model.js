"use strict";
const Matrix = require("./matrix");
const Activation = require("./activation");

class Model {
  constructor(model,data,activationF,learningRate) {
    this.model = model // the number of neurons in each layer, counting input and output layers
    this.length = model.length
    this.data = new Matrix(data)
    this.y = this.data.getCols(0,1)
    this.x = this.data.getCols(1,this.data.m)
    this.x = this.x.transpose()
    this.activationF = activationF
    this.learningRate = learningRate

    this.weightMatrices = this.createWeightMatrices()
  }

  createWeightMatrices() {
    let weightMatrices = []
    // for each later, we need to map a_n (i elements) to a_n+1 (j elements)
    // we multiply A_n*a_n = a_n+1, so the matrix A_n is j x i
    // we add one to a_n i to account for the bias term being added
    for (var i = 0; i < this.length-1; i++) {
      weightMatrices.push(Matrix.randomMatrix(this.model[i+1],this.model[i]+1))
    }
    return weightMatrices
  }

  iterate() {
    // accumulator for deltas of each layer
    let accumulator = this.getAccum(this.model)
    let layerValues
    // forward and back prop for each observation
    for (var i = 0; i < this.y.n; i++) {
      layerValues = this.forwardProp(i)
      accumulator = this.backProp(accumulator,layerValues,i)
    }
  }

  // creates array of vectors of 0s matching model with bias
  getAccum() {
    let accum = []
    let array
    for (var i = 0; i < this.length-1; i++) {
      array = []
      for (var j = 0; j < this.model[i]+1; j++) {
        array.push([0])
      }
      accum.push(new Matrix(array))
    }
    // last layer has no bias
    array = []
    for (var j = 0; j < this.model[i]; j++) {
      array.push([0])
    }
    accum.push(new Matrix(array))

    return accum
  }

  // conducts forward prop for observation n, returns all neuron layers as 2D array
  forwardProp(n) {
    let layer = this.x.getCols(n,n+1)
    let layerValues = [layer]
    let weightMatrix
    // calculates each layer
    for (var i = 0; i < this.length-1; i++) {
      weightMatrix = this.weightMatrices[i]
      layer = this.calculateLayer(weightMatrix,layer)
      layerValues.push(layer)
    }
    return layerValues
  }

  calculateLayer(weightMatrix,prevLayer) {
    let prevWithBias = prevLayer.addBias()
    let product = weightMatrix.multiply(prevWithBias)
    let nextLayer = product.elementWiseFunction(this.activationF)
    return nextLayer
  }

  backProp(accumulator,layerValues,n) {
    // final layer
    let d = this.y[n]
    accumulator[this.length-1] = accumulator[this.length-1].add()

  }
}


let m = new Model([2,3,1],[[1,2,3],[0,4,5]],Activation["sigmoid"])

// console.log(m.forwardProp(0));
console.log(m.iterate());
