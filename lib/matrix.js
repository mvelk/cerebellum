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

  sumAbsAll() {
    let sum = 0;
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.m; j++) {
        sum += Math.abs(this.array[i][j]);
      }
    }
    return sum;
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

  rowWiseMultiply(matrix) {
    if (!this.canDot(matrix)){
      throw "Can't find row multiply, incorrect dimensions";
    }
    let product = [];
    for (var i = 0; i < this.n; i++) {
      product.push([this.array[i][0]*matrix.array[i][0]]);
    }
    return new Matrix(product);
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
        row.push(Math.random()*2-1);
      }
      array[i] = row;
    }
    return new Matrix(array);
  }
}

module.exports = Matrix;
