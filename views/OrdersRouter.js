const express = require("express");
const router = express.Router();

const PedidosController = require("../controllers/PedidosController");

router.post("/", PedidosController.placeNewPedido);

module.exports = router;
