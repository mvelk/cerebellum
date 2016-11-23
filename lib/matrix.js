"use strict";

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

    let sum
    let array = this.emptyClone()
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < matrix.m; j++) {
        sum = 0
        for (var k = 0; k < this.m; k++) {
          sum += this.array[i][k]*matrix.array[m][j]
        })
        array[i][j] = sum
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

  //same as slice but slices for all rows
  getCols(a,b) {
    let cols = []
    for (var i = 0; i < this.n; i++) {
      cols.push(this.array[i].slice(a,b))
    }
    return cols
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

  // calls fn for each element of matrix and returns matrix of new values
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
    sum = 0;
    for (var i = 0; i < array1.length; i++) {
      sum += this.array[i][0]*matrix.array[i][0]
    }
    return sum
  }

  // appends a row of 1s to the top of a matrix
  addBias(){
    let array = this.array.slice()
    array.unshift(new Array(this.m).fill(1))
    return new Matrix(array);
  }

  // creates identity matrix of dim nxn
  static identity(n){
    let array = new Array(n)
    for (var i = 0; i < n; i++) {
      array[i] = new Array(n).fill(0)
    }
    for (var i = 0; i < n; i++) {
      array[i][i] = 1
    }
    return new Matrix(array)
  }

  static randomMatrix(n,m) {
    let array = new Array(n)
    let row
    for (var i = 0; i < n; i++) {
      row = []
      for (var j = 0; j < m; j++) {
        row.push(Math.random())
      }
      array[i] = row
    }
    return new Matrix(array)
  }
}

let m = new Matrix([[1,2,3],[4,5,6],[7,8,9]])
let m2 = new Matrix([[0,1,0],[0,1,0],[0,1,0]])
let v = new Matrix([[1],[2],[3]])
let v2 = new Matrix([[1],[2],[3]])
let m1 = Matrix.identity(3)
console.log(m.multiply(m2));
console.log(v.dotProduct(v2));

module.exports = Matrix
