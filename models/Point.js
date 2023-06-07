const mongoose = require("../database/mongo");

const pointSchema = new mongoose.Schema(
  {
    titulo: String,
    descricao: String,
    dataInicio: { type: Date, default: Date.now },
    dataTermino: { type: Date, default: Date.now },
    localizacao: String,
  },
  { collection: "point" }
);

pointSchema.index(
  { titulo: "text", descicao: "text" },
  { default_language: "pt", weights: { titulo: 2, descricao: 1 } }
);

const Point = mongoose.model("Point", pointSchema);

module.exports = Point;
