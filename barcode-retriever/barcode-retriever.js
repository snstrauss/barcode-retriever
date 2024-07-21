const express = require("express");
const axios = require("axios");

const app = express();

const PORT = 1337;

app.use(express.json());

app.post("/get-barcode", (req, res) => {
  const { code } = req.body;

  console.log(`got request - ${code}`);

  if (code) {
    requestBarcodeFromOrca(code)
      .then((barcodeSvg) => {
        res.send(barcodeSvg);
      })
      .catch((e) => {
        errorResponse(res, e);
      });
  } else {
    errorResponse(res, `'code' argument is missing!`);
  }
});

app.get("/hey", (req, res) => {
  console.log("got `hey` request");

  res.send("ho!");
});

function requestBarcodeFromOrca(code) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://barcode.orcascan.com/?type=code128&data=${code}`)
      .then((barcodeResponse) => {
        resolve(barcodeResponse.data);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}

function errorResponse(res, error) {
  res.status(400).send(error);
}

app.listen(PORT, () => {
  console.log(`barcode retriever is running on port ${PORT}`);
});
