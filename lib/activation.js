const Activation = {
  "sigmoid" : {
    "activation" : (n) => {
      return 1/(1+Math.exp(-n));
    },
    "derivative" : (n) => {
      return n*(1-n);
    }
  },
  "tanh" : {
    "activation" : (n) => {
      let e2 = Math.exp(2*n)
      return (e2-1)/(e2+1);
    },
    "derivative" : (n) => {
      let e2 = Math.exp(2*n)
      let tanh = (e2-1)/(e2+1);
      return 1-tanh*tanh;
    }
  },
  "loss" : (y,yHat) => {
    return -(y*Math.log(yHat) + (1-y)*Math.log(1-yHat));
  }
};

module.exports = Activation;
