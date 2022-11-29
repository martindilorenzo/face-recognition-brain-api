const fetch = require('node-fetch');
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");


const APP_ID = 'my-first-application';
const USER_ID = 'martin_dilo';
//Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '4ad2607696604c05892bf3961023759e';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';


const handleApiCall = () => (req, res) => {
  const stub = ClarifaiStub.grpc();
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key 4ad2607696604c05892bf3961023759e");

  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
      user_app_id: {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      model_id: MODEL_ID,
      inputs: [{ data: { image: { url: req.body.input } } }]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
        return;
      }

      res.json(response);
    }
  );

}


const handleImage = (database) => (req, res) => {
  const { id } = req.body;
  database('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(400).json('No se puede obtener entradas'));
}

module.exports = {
  handleImage,
  handleApiCall
}