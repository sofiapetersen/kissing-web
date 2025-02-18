const express = require('express');
const supabase = require('../client');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Adicione esta linha

(async () => {
    const { data, error } = await supabase.from("pessoas").select("*").limit(1);
    if (error) console.error("Erro na conexão com o Supabase:", error);
    else console.log("Conexão bem-sucedida! Exemplo de dado:", data);
})();


// Endpoint para adicionar nome
app.post('/addname', async (req, res) => {
    const { name, instagram } = req.body;
    try {
        const { data, error } = await supabase
            .from('pessoas')
            .insert([{ name, instagram }])
            .single();
        if (error) {
            console.error('Erro ao adicionar nome:', error.message);
            res.status(500).json({ success: false, error: error.message });
        } else {
            console.log('Nome adicionado:', data);
            res.json({ success: true, data });
        }
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
            .from('conexoes')
            .insert([{ name1, name2, connection_type: 'kiss' }])
            .single();
        if (error) {
            console.error('Erro ao criar conexão:', error.message);
            res.status(500).json({ success: false, error: error.message });
        } else {
            console.log('Conexão criada:', data);
            res.json({ success: true, data });
        }
    } catch (error) {
        console.error('Erro ao criar conexão:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para obter conexões de um nome específico
app.post('/api/getconnections', async (req, res) => {
    const { searchName } = req.body;
    try {
        const { data, error } = await supabase
            .from('conexoes')
            .select('*')
            .or(`name1.eq.${searchName},name2.eq.${searchName}`);
        if (error) {
            console.error('Erro ao obter conexões:', error.message);
            res.status(500).json({ success: false, error: error.message });
        } else {
            const nodes = [{ id: searchName, label: searchName }];
            const edges = data.map(row => {
                const connectedName = row.name1 === searchName ? row.name2 : row.name1;
                nodes.push({ id: connectedName, label: connectedName });
                return { source: searchName, target: connectedName };
            });
            res.json({ success: true, nodes, edges });
        }
    } catch (error) {
        console.error('Erro ao obter conexões:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para obter todas as conexões
app.get('/api/getallconnections', async (req, res) => {
    try {
        const { data: namesData, error: namesError } = await supabase.from('pessoas').select('*');
        const { data: connectionsData, error: connectionsError } = await supabase.from('conexoes').select('*');
        if (namesError || connectionsError) {
            console.error('Erro ao obter todas as conexões:', namesError || connectionsError);
            res.status(500).json({ success: false, error: namesError || connectionsError });
        } else {
            const nodes = namesData.map(row => ({ id: row.name, label: row.name }));
            const edges = connectionsData.map(row => ({ source: row.name1, target: row.name2 }));
            res.json({ success: true, nodes, edges });
        }
    } catch (error) {
        console.error('Erro ao obter todas as conexões:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Rota para a página inicial
app.get('/api/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});