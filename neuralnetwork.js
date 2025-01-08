"use strict";

const sigmoid = {
    func: x => 1 / (1 + Math.exp(-x)),
    deriv: x => {
        let e = Math.exp(-x);

        return e / (1 + e) / (1 + e);
    },
};

const leakyReLU = {
    func: x => (x >= 0 ? x : x * 0.1),
    deriv: x => (x >= 0 ? 1 : 0.1),
};

class Neuron {
    constructor(num, activationFunc) {
        this.weights = Array.from({ length: num }, () => Math.random() - 0.5);
        this.bias = Math.random() - 0.5;
        this.activationFunc = activationFunc?.func;
        this.activationDeriv = activationFunc?.deriv;
    }

    activate(inputs) {
        if (inputs.length !== this.weights.length) throw new Error("Bad input length!");

        return this.activationFunc(
            this.weights.reduce((accum, curr, idx) => accum + curr * inputs[idx], 0) + this.bias
        );
    }

    copy() {
        const copy = new Neuron;

        copy.weights = [...this.weights];
        copy.bias = this.bias;
        copy.activationFunc = this.activationFunc;
        copy.activationDeriv = this.activationDeriv;

        return copy;
    }

    mutate(amount) {
        this.weights = this.weights.map(x => x + Math.random() * amount * 2 - amount);
        this.bias += Math.random() * amount * 2 - amount;
    }
}

class NeuralNetwork {
    constructor(...layerMap) {
        this.layerMap = layerMap;
        this.layers = [];

        let numInputs = layerMap[0];
        layerMap.forEach((num, idx) => {
            if (idx === 0) return;

            this.layers.push(
                Array.from(
                    { length: num },
                    () =>
                        new Neuron(numInputs, idx === layerMap.length - 1 ? sigmoid : leakyReLU)
                )
            );

            numInputs = num;
        });
    }

    forwardPropigate(inputs) {
        let outputs = [...inputs];

        this.layers.forEach(layer => {
            outputs = layer.map(node => node.activate(outputs));
        });

        return outputs;
    }

    copy() {
        const copy = new NeuralNetwork(0);

        copy.layerMap = [...this.layerMap];
        copy.layers = this.layers.map(layer => layer.map(node => node.copy()));

        return copy;
    }

    json() {
        return {
            layerMap: this.layerMap,
            layers: this.layers.map(layer => layer.map(node => ({
                bias: node.bias,
                weights: node.weights,
            }))),
        };
    }

    static fromJson(json) {
        const net = new NeuralNetwork(...json.layerMap);

        net.layers.forEach((layer, layerIdx) => layer.forEach((node, nodeIdx) => {
            node.bias = json.layers[layerIdx][nodeIdx].bias;
            node.weights = json.layers[layerIdx][nodeIdx].weights;
        }));

        return net;
    }

    mutate(amount) {
        this.layers.forEach(layer => layer.forEach(node => Math.random() < 0.6 && node.mutate(amount)));
    }
}

function getData() {
    return networks.map(network => {
        let error = 0;

        trainingData.forEach(data => {
            const outputs = network.forwardPropigate(data.inputs);

            outputs.forEach((output, idx) => {
                error += Math.abs(data.targets[idx] - output);
            });
        });

        return {
            network: network,
            error: error
        };
    }).sort((a, b) => a.error - b.error);
}

const trainingData = [
    { inputs: [0, 0, 0], targets: [0] },
    { inputs: [1, 0, 0], targets: [1] },
    { inputs: [0, 1, 0], targets: [1] },
    { inputs: [1, 1, 0], targets: [0] },
    { inputs: [0, 0, 1], targets: [1] },
    { inputs: [1, 0, 1], targets: [0] },
    { inputs: [0, 1, 1], targets: [0] },
    { inputs: [1, 1, 1], targets: [0] }
];

let networks = Array.from({ length: 10000 }, () => new NeuralNetwork(3, 9, 1));

document.getElementById("before").innerHTML = getData().reduce((accum, curr) => accum + curr.error, 0) / networks.length;

let final;

for (let epoch = 0; epoch < 1000; epoch++) {
    const data = getData();

    const totalError = data.reduce((accum, curr) => accum + curr.error, 0);
    const averageError = totalError / networks.length;

    final = data;

    let i = 0;
    networks = Array.from({ length: 200 }, () => {
        const best = data[Math.floor(Math.random() * 10)];
        const copy = best.network.copy();

        copy.mutate(i < 10 ? 10 : (best.error + averageError / 2));

        i++;

        return i < 150 ? copy : new NeuralNetwork(...best.network.layerMap);
    });
}

document.getElementById("after").innerHTML = getData().reduce((accum, curr) => accum + curr.error, 0) / networks.length;

let results = "";

trainingData.forEach(data => {
    results += `<br>Inputs: ${data.inputs} Outputs: ${final[0].network.forwardPropigate(data.inputs)}`;
});

document.getElementById("result").innerHTML = results;

console.log(JSON.stringify(final[0].network.json()));
