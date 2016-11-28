const Activation = {
  "sigmoid" : (n) => {
    return 1/(1+Math.exp(-n));
  },
  "sigmoid loss" : (y,yHat) => {
    return -(y*Math.log(yHat) + (1-y)*Math.log(1-yHat));
  }
};

module.exports = Activation;
