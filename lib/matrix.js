"use strict";
const Activation = require("./activation");

class Matrix {
  constructor(array) {
    this.array = array // [[1,2,3],[4,5,6]]
    this.n = array.length
    this.m = array[0].length
  }

  canMultiply(matrix) {
    return this.m === matrix.n
  }

  multiply(matrix) {
    if (!this.canMultiply(matrix)) {
      throw "Can't multiply, incorrect dimensions"
    }

    let array = this.emptyClone()
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < matrix.m; j++) {
        let row = this.getRow(i)
        let col = matrix.getCol(j)
        array[i][j] = this.dotHelper(row,col)
      }
    }

    return new Matrix(array)
  }

  canArithmetic(matrix) {
    return this.n === matrix.n && this.m === matrix.m
  }

  add(matrix){
    if (!this.canArithmetic(matrix)) {
      throw "Can't add/subtract, incorrect dimensions"
    }

    let array = this.emptyClone()
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.m; j++) {
        array[i][j] = this.array[i][j] + matrix.array[i][j]
      }
    }

    return new Matrix(array)
  }

  subtract(matrix){
    if (!this.canArithmetic(matrix)) {
      throw "Can't add/subtract, incorrect dimensions"
    }

    let array = this.emptyClone()
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.m; j++) {
        array[i][j] = this.array[i][j] - matrix.array[i][j]
      }
    }

    return new Matrix(array)
  }

  getCol(m) {
    let col = []
    for (var i = 0; i < this.n; i++) {
      col.push(this.array[i][m])
    }
    return col
  }

  getRow(n) {
    return this.array[n]
  }

  transpose() {
    let array = this.emptyClone()
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.m; j++) {
        array[j][i] = this.array[i][j]
      }
    }
    return new Matrix(array)
  }

  elementWiseFunction(fn) {
    let array = this.emptyClone()
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.m; j++) {
        array[i][j] = fn(this.array[i][j])
      }
    }
    return new Matrix(array)
  }

  emptyClone() {
    let array = new Array(this.n)
    for (var i = 0; i < this.n; i++) {
      array[i] = new Array(this.m)
    }
    return array
  }

  canDot(matrix) {
    return this.m === 1 && matrix.m === 1 && this.n === matrix.n
  }

  dotProduct(matrix){
    if (!this.canDot(matrix)){
      throw "Can't find dot product, incorrect dimensions"
    }

    let col1 = this.getCol(0)
    let col2 = matrix.getCol(0)
    this.dotHelper(col1,col2)
  }

  dotHelper(array1,array2) {
    let answer = 0
    for (var i = 0; i < array1.length; i++) {
      answer += array1[i]*array2[i]
    }
    return answer
  }

  addBias(){
    this.array.unshift([1])
  }

  static identity(n){
    let array = new Array(n)
    for (var i = 0; i < n; i++) {
      array[i] = new Array(n).fill(0)
    }
    for (var i = 0; i < n; i++) {
      array[i][i] = 1
    }
    return array
  }
}

let m = new Matrix([[1,2,3],[4,5,6],[7,8,9]])
let ma = new Matrix([[1,0,0],[0,1,0],[0,0,1]])
let c1 = new Matrix([[1],[2],[3]])
let c2 = new Matrix([[1],[2],[3]])
const fn = (n) => {
  return n + 1
}
console.log(c1.dotProduct(c2));
console.log(Matrix.identity(3));

module.exports = Matrix
