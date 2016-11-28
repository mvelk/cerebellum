const Activation = {
  "sigmoid" : (n) => {
    return 1/(1+Math.exp(-n));
  }
};

module.exports = Activation;
