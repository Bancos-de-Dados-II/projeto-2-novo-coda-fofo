const mongoose = require('mongoose');

const ResponsavelSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  departamento: { type: String, required: true },
  disponivel: { type: Boolean, default: true },
  neo4jId: { type: String } // Armazena o ID do nó no Neo4j
});

module.exports = mongoose.model('Responsavel', ResponsavelSchema);