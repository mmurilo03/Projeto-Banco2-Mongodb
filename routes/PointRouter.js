const express = require('express');
const router = express.Router();

const PointController = require("../controllers/PointController")

router.get("/", PointController.listarPontos)
router.get("/:id", PointController.pesquisaPorId)
router.post("/", PointController.salvarPonto)
router.delete("/:id", PointController.deletarPonto)
router.patch("/:id", PointController.atualizarPonto)
router.post("/pesquisa", PointController.pesquisaPorTexto)

module.exports = router;