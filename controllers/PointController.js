const Point = require("../models/Point");

const listarPontos = async (req, res) => {
  const points = await Point.find()
    .then((result) => result)
    .catch((e) => res.status(400).send(e));
  res.status(200).send(points);
};

const salvarPonto = async (req, res) => {
  const obj = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    dataInicio: req.body.dataInicio,
    dataTermino: req.body.dataTermino,
    localizacao: `${req.body.lng} ${req.body.lat}`,
  };
  console.log(obj);
  const point = await Point.create(obj)
    .then((result) => result)
    .catch((e) => res.status(400).send(e));
  if (point) {
    res.status(201).send(point);
  }
};

const deletarPonto = async (req, res) => {
  Point.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) res.status(200).send("Ponto removido");
      else res.status(404).send("Ponto não encontrado");
    })
    .catch((e) => res.status(400).send(e));
};

const atualizarPonto = async (req, res) => {
  const obj = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    dataInicio: req.body.dataInicio,
    dataTermino: req.body.dataTermino,
    localizacao: `${req.body.lng} ${req.body.lat}`,
  };
  await Point.findById(req.params.id)
    .then((result) => {
      if (result) {
        result.set(obj);
        result.save();
        res.status(200).send("Ponto atualizado");
      }
    })
    .catch((e) => res.status(404).send("Ponto não encontrado"));
};

const pesquisaPorTexto = async (req, res) => {
  const points = await Point.find(
    { $text: { $search: req.body.pesquisa } },
    { _id: false, __v: false }
  )
    .then((result) => result)
    .catch((e) => res.status(400).send(e));
  res.status(200).send(points);
};

module.exports = {
  listarPontos,
  salvarPonto,
  deletarPonto,
  atualizarPonto,
  pesquisaPorTexto,
};
