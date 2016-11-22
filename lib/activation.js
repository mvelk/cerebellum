const Activation = {
  "sigmoid" : function(n) {
    return 1/(1+Math.exp(-n))
  }
}

modules.export = Activation
