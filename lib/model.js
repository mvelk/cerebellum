"use strict";
const Matrix = require("./matrix");
const Activation = require("./activation");

class Model {
  constructor(model,data,activationF,learningRate) {
    this.model = model // the number of neurons in each layer, counting input and output layers
    this.data = new Matrix(data)
    this.y = this.data.getCols(0,1)
    this.x = this.data.getCols(1,this.data.m)
    this.x = this.x.transpose()
    this.activationF = activationF
    this.learningRate = learningRate

    this.weightMatrices = this.createWeightMatrices(model)
  }

  createWeightMatrices(model) {
    let weightMatrices = []
    // for each later, we need to map a_n (i elements) to a_n+1 (j elements)
    // we multiply A_n*a_n = a_n+1, so the matrix A_n is j x i
    // we add one to a_n i to account for the bias term being added
    for (var i = 0; i < model.length-1; i++) {
      weightMatrices.push(Matrix.randomMatrix(this.model[i+1],this.model[i]+1))
    }
    return weightMatrices
  }

  // conducts forward prop for sample data pair n
  forwardProp(n){
    let layer = this.x.getCols(n,n+1)
    let layerValues = [layer]
    let weightMatrix
    // calculates each layer
    for (var i = 0; i < this.model.length-1; i++) {
      weightMatrix = this.weightMatrices[i]
      layer = this.calculateLayer(weightMatrix,layer)
      layerValues.push(layer)
    }
    return layerValues
  }

  calculateLayer(weightMatrix,prevLayer){
    console.log("matrix");
    console.log(weightMatrix);
    let prevWithBias = prevLayer.addBias()
    console.log("layer");
    console.log(prevWithBias);

    let product = weightMatrix.multiply(prevWithBias)
    let nextLayer = product.elementWiseFunction(this.activationF)
    console.log("next");
    console.log(nextLayer);
    return nextLayer
  }
}

let m = new Model([2,3,1],[[1,2,3],[0,4,5]],Activation["sigmoid"])

console.log(m.forwardProp(0));
