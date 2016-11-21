## ML Playground

### Background

Machine learning is a hot buzzword in the tech industry, but it is often misunderstood by the public. We aim to shed light on the techniques used to model simple data by visualizing the learning process of a simple neural network.

Development of the app will be inspired by the visualization provided by Tensorflow. <a href="http://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.04370&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false">Tensorflow Playground</a>.

### Functionality & MVP

With this app, users will be able to:

- [ ] Select from several randomly generated training datasets (3 patterns)
- [ ] Train a neural network in realtime using a Javascript machine learning library rolled from scratch
- [ ] Visualize the results using canvas

### Bonuses

- [ ] Additional activation functions
- [ ] Custom parameters including learning rate
- [ ] Graph of accuracy over time

### Wireframes

![wireframes]()

### Technologies & Technical Challenges

This app will be implemented using the Javascript and Canvas.

- `playground.js`: master file that performs data generation
- `render.js`: will perform the canvas manipulation to visualize the results of each pass
- `iterate.js`: will contain the logic to perform one iteration through neural network
- `matrix.js`: will contain the matrix math logic for the machine learning algorithm
- `activation_functions.js`: will contain the logic for the activation function(s)
- `back_prop.js`: will contain the logic for the back-propagation algorithm
- `forward_prop.js`: will contain the logic for the forward_propagation algorithm

There will also be two HTML files to display the content:

- `playground.html`: main page with visualization and controls
- `stylin.css`: the magic sauce that will make everything come together

The primary technical challenges will be:

- Rolling a machine learning algorithm from scratch in JAVASCRIPT!!!
- Creating an original UI that will allow users to interact with and customize the model.
- Generating a visually compelling visualization of the data (potential to use D3.js here).

### Implementation Timeline

**Day 1**: Matrix.js -- generating data sets dynamically by parsing images.
**Day 2**: Begin on machine learning logic including iterate.js, back_prop.js and forward_prop.js.
**Day 3**: Continue on machine learning logic.
**Day 4**: Finalize machine learning logic and begin on visualization/front-end.
**Day 5**: Continue on visualization/front-end. Begin to implement bonuses, including additional activation functions and custom learning rate.
**Day 6**: Eat turkey.
