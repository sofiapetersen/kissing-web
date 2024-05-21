const express = require('express');
const pool = require('./database');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para adicionar nome
app.post('/addname', async (req, res) => {
    const { name, instagram } = req.body; // Agora estamos pegando o nome e o Instagram do corpo da requisição
    try {
      const result = await pool.query('INSERT INTO names (name, instagram) VALUES ($1, $2) RETURNING id', [name, instagram]); // Inserindo também o Instagram no banco de dados
      res.json({ success: true, id: result.rows[0].id });
    } catch (error) {
      console.error('Erro ao adicionar nome:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

// Endpoint para criar conexão
app.post('/createconnection', async (req, res) => {
  const { name1, name2 } = req.body;
  try {
    await pool.query(
      'INSERT INTO connections (name1, name2, connection_type) SELECT $1::text, $2::text, $3 WHERE EXISTS (SELECT 1 FROM names WHERE name = $1) AND EXISTS (SELECT 1 FROM names WHERE name = $2)',
      [name1, name2, 'kiss']
    );
    res.json({ success: true, message: `Conexão entre '${name1}' e '${name2}' criada com sucesso!` });
  } catch (error) {
    console.error('Erro ao criar conexão:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para obter conexões de um nome específico
app.post('/getconnections', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('SELECT * FROM connections WHERE name1 = $1 OR name2 = $1', [name]);
    const nodes = [];
    const edges = [];

    // Adiciona o nó principal
    nodes.push({ id: name, label: name });

    // Adiciona os nós e arestas das conexões
    result.rows.forEach(row => {
      const connectedName = row.name1 === name ? row.name2 : row.name1;
      nodes.push({ id: connectedName, label: connectedName });
      edges.push({ source: name, target: connectedName });
    });

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Erro ao obter conexões:', error.message);
    res.status(500).json({ error: 'Erro ao obter conexões' });
  }
});

// Endpoint para obter todas as conexões
app.get('/getallconnections', async (req, res) => {
  try {
    const nodesResult = await pool.query('SELECT * FROM names');
    const edgesResult = await pool.query('SELECT * FROM connections');

    const nodes = nodesResult.rows.map(row => ({ id: row.name, label: row.name }));
    const edges = edgesResult.rows.map(row => ({ source: row.name1, target: row.name2 }));

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Erro ao obter todas as conexões:', error.message);
    res.status(500).json({ error: 'Erro ao obter todas as conexões' });
  }
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
