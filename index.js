const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = 'https://pygqirmwmklcmhbgflgp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para adicionar nome
app.post('/addname', async (req, res) => {
    const { name, instagram } = req.body;
    try {
        const { data, error } = await supabase
            .from('names')
            .insert([{ name, instagram }])
            .select('id');
        
        if (error) throw error;

        res.json({ success: true, id: data[0].id });
    } catch (error) {
        console.error('Erro ao adicionar nome:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para criar conexão
app.post('/createconnection', async (req, res) => {
    const { name1, name2 } = req.body;
    try {
        const { data, error } = await supabase
            .from('connections')
            .insert([{ name1, name2, connection_type: 'kiss' }]);

        if (error) throw error;

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
        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .or(`name1.eq.${name},name2.eq.${name}`);
        
        if (error) throw error;

        const nodes = [{ id: name, label: name }];
        const edges = data.map(row => {
            const connectedName = row.name1 === name ? row.name2 : row.name1;
            nodes.push({ id: connectedName, label: connectedName });
            return { source: name, target: connectedName };
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
        const { data: nodesData, error: nodesError } = await supabase
            .from('names')
            .select('*');
        
        if (nodesError) throw nodesError;

        const { data: edgesData, error: edgesError } = await supabase
            .from('connections')
            .select('*');
        
        if (edgesError) throw edgesError;

        const nodes = nodesData.map(row => ({ id: row.name, label: row.name }));
        const edges = edgesData.map(row => ({ source: row.name1, target: row.name2 }));

        res.json({ nodes, edges });
    } catch (error) {
        console.error('Erro ao obter todas as conexões:', error.message);
        res.status(500).json({ error: 'Erro ao obter todas as conexões' });
    }
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
