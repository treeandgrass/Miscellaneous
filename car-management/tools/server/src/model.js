const KerasJS = require('keras-js');
const model = new KerasJS.Model({
    filepaths: {
      model: 'http://127.0.0.1:8080/inputsresnet_1_3.json',
      weights: 'http://127.0.0.1:8080/resnet_1_3_config_weights_weights.buf',
      metadata: 'http://127.0.0.1:8080/resnet_1_3_config_weights_metadata.json'
    }
});

// let data = {input_1: new Float32Array(400 * 400 * 3)};

// model.predict(data);
// model.ready().then(() => {
//     console.log('loadd success')
//     // model.predict(data);
// })

module.exports = model

