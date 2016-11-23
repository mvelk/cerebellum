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
    let weightMatrices = [undefined] // added element to match index with notation
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
    let accumulator = this.getAccum()
    let layerValues
    // forward and back prop for each observation
    for (var i = 0; i < this.y.n; i++) {
      layerValues = this.forwardProp(i)
      accumulator = this.backProp(accumulator,layerValues,i)
    }
    this.incrementWeights()
  }

  // creates array of vectors of 0s matching model with bias
  getAccum() {
    let accum = [undefined]
    let weightMatrix
    for (var i = 1; i < this.length; i++) {
      weightMatrix = this.weightMatrices[i]
      accum.push(Matrix.emptyMatrix(weightMatrix.n,weightMatrix.m))
    }
    return accum
  }

  // conducts forward prop for observation n, returns all neuron layers as 2D array
  forwardProp(n) {
    let layer = this.x.getCols(n,n+1)
    let layerValues = [layer]
    let weightMatrix
    // calculates each layer
    for (var i = 1; i < this.length; i++) {
      weightMatrix = this.weightMatrices[i]
      layer = this.forwardLayer(weightMatrix,layer)
      layerValues.push(layer)
    }
    return layerValues
  }

  // a^n = g(A^n-1*(a^n-1 + bias))
  forwardLayer(weightMatrix,prevLayer) {
    let prevWithBias = prevLayer.addBias()
    let product = weightMatrix.multiply(prevWithBias)
    let nextLayer = product.elementWiseFunction(this.activationF)
    return nextLayer
  }

  backProp(accumulator,layerValues,n) {
    let currentY = this.y.getRows(n,n+1)
    // final layer: d^n = a^n - y
    console.log(layerValues);
    let d = layerValues[this.length-1].subtract(this.y.getRows(n,n+1))
    let daT = d.multiply(layerValues[this.length-2].addBias().transpose()) // d^i+1 * (a^i)T
    accumulator[this.length-1] = accumulator[this.length-1].add(daT) // D_ij = D_ij + a_j * d_i

    let weightMatrix
    let layer
    // other layers: d^n = (A^n)T * d^n+1 * (a^n . (1 - a^n)), stop at input layer
    for (var i = this.length-1; i > 0; i--) {
      weightMatrix = this.weightMatrices[i] // A^n
      layer = layerValues[i] // a^n
      d = this.backLayer(weightMatrix,d,layer) // d^n = backLayer(A^n,d^n+1,a^n)
      // console.log(d);
      // console.log(layerValues[i-1].addBias().transpose());
      daT = d.multiply(layerValues[i-1].addBias().transpose()) // D_ij = D_ij + a_j * d_i
      accumulator[i] = accumulator[i].add(d)
    }

    return accumulator
  }

  // other layers: d^n = (A^n)T * d^n+1 * (a^n . (1 - a^n))
  backLayer(weightMatrix,d,layer) {
    let dG = layer.dotProduct(Matrix.vector(layer.n,1).subtract(layer)) // (a^n . (1 - a^n))
    console.log(dG);
    console.log(weightMatrix);
    let ATd = weightMatrix.transpose().multiply(d)// (A^n)T * d^n+1
    return ATd.multiply(dG) // (A^n)T * d^n+1 * (a^n . (1 - a^n))
  }

  // increments weights according to accumulator
  incrementWeights(accumulator,layerValues) {
    for (var i = 1; i < this.length; i++) {
      let increment  // d^i+1 * (a^i)T
    }
  }
}

// let m1 = new Matrix([[1,2],[3,4]])
// let m2 = new Matrix([[1,2],[3,4]])
// console.log(m1.transpose());
let m = new Model([2,5,5,1],[[1,2,3],[0,4,5]],Activation["sigmoid"])
m.iterate()
