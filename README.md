# Cerebellum

Machine learning is a hot buzzword in the tech industry, but it is often misunderstood by the public. We aim to shed light on the techniques used to model simple data by visualizing the learning process of a simple neural network with
[Cerebellum]().

Development of the app will be inspired by the visualization provided by Tensorflow. <a href="http://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.04370&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false">Tensorflow Playground</a>.


### Background

Neural networks are a popular class of machine learning algorithms. A good way to visualize how neural networks works is as an attempt to approximate an output Y given a column vector X by it by multiplying several matrices. On each step of matrix multiplication, we call the output a "layer of neurons".

The process of producing proceeding layers is given as the following:
 - Suppose we have an n dimensional vector for an input layer (also known as a layer of perceptrons); we first add a constant bias term to the column vector with a value of 1, turning it into an n+1 vector.
 - Next we multiply it by an m x (n+1) dimensional matrix; so the next layer would then be a layer of m neurons.
 - We also add non-linearity by inputting each value of the m vector into an activation function.
Thus, a layer in terms of the previous layer can be given by: a<sup>n</sup> = g(A<sup>n-1</sup> * (a<sup>n-1</sup> + bias)), where a<sup>n</sup> is the n<sup>th</sup> layer, A<sup>n</sup> is the matrix that maps a<sup>n-1</sup> to a<sup>n</sup>, and g is the activation function.

The objective of a neural network is to come up with a series of such matrices that accurately predicts output y given input x, for the given training data set. The incremental process of fitting these matrices is done via gradient descent, simplified by back-propagation.

The process of back-propagation is accomplished as follows. Find the deltas of the final layer: d<sup>n</sup> = a<sup>n</sup> - y, where y are the real output values of the training data. The deltas of the other layers are given as: d<sup>n</sup> = (A<sup>n</sup>)<sup>T</sup> * d<sup>n+1</sup> .* (a<sup>n</sup> .* (1 - a<sup>n</sup>)), where .* is a row wise multiplication and d<sup>n+1</sup> is the delta from the n+1 layer. These deltas are then multiplied with their corresponding layer to get the values their matrix has to be incremented by: A<sup>n</sup> := A<sup>n</sup> - (1/m) d<sup>i+1</sup> * (a<sup>i</sup>)<sup>T</sup>.

If you are familiar with linear regression, you can picture the neural network as a linear regression model (y = a*x + b) with the vector of a = [a<sub>0</sub>, a<sub>1</sub>, a<sub>2</sub>...] coefficients replaced by a few matrices of coefficients.

### Model Representation

We represent the connection between each layer (AKA the matrix A<sup>n</sup>) with a sankey diagram with lines widths equal to the magnitude of the matrix weights. The lines are color coded according to whether the weight is positive or negative.

## Features & Implementation

### Implementing Neural Network from Scratch

We first implemented all the required matrix math in the [matrix.js][lib/matrix] file. Using these methods, we reproduced the machine learning formulas:

a<sup>n</sup> = g(A<sup>n-1</sup> * (a<sup>n-1</sup> + bias)):
```js
forwardLayer(weightMatrix,prevLayer) {
  let prevWithBias = prevLayer.addBias(); // adds a row of 1 to the top of vector
  let product = weightMatrix.multiply(prevWithBias);
  let nextLayer = product.elementWiseFunction(this.activationF);
  return nextLayer;
}
```

d<sup>n</sup> = (A<sup>n</sup>)<sup>T</sup> * d<sup>n+1</sup> .* (a<sup>n</sup> .* (1 - a<sup>n</sup>)):
```js
backLayer(weightMatrix,d,layer) {
  let dG = layer.elementWiseFunction(this.derivativeF); // g'(a^n)
  let ATd = weightMatrix.transpose().multiply(d); // (A^n)T * d^n+1
  let newD = ATd.rowWiseMultiply(dG); // (A^n)T * d^n+1 .* g'(a^n)
  return newD;
}
```

### Visualizing Neural Network Training

We used the d3-sankey-diagram library to render the sankey diagram. This reduced the code to produce sankey diagrams to:
``` js

let diagram = sankeyDiagram()
  .width(800)
  .height(500)
  .margins({ left: 40, right: 60, top: 10, bottom: 10 })
  .nodeTitle(function(d) { return d.data.title !== undefined ? d.data.title : d.id; })
  .linkTypeTitle(function(d) { return d.data.title; })
  .linkColor(function(d) { return d.data.color; })
  .linkOpacity(0.7);

data = model.getSankeyData();
d3.select('#sankey').datum(data).call(diagram);

```
The getSankeyData method pulls the matrices from our model object and creates an array of POJOs equal to:

``` js
{
  nodes:{
    {id:"a"},
    {id:"b"}
  },
  links:{
    {source:"a", target:"b", value:1}
  }
}

```

### Selecting Random Datasets

The training data our model uses is randomly sampled from various pictures we made, by taking random x,y coordinates and their color (represented by 0 or 1). We accomplished this by first drawImage() on a canvas, then getImageData() at the specific x,y coordinate.

### Custom Parameters

We allow various model parameters to be adjusted, such as learning rate, by passing these values into the model object constructor.

## Future Directions

### Custom layers

The model class already responds to different number of layers and neurons, we only need to implement a way to adjust these values in the UI.
