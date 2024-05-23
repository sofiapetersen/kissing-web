import { createClient } from '@supabase/supabase-js';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = 'https://pygqirmwmklcmhbgflgp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());

// Endpoint para obter todas as conexões
app.get('/getallconnections', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('connections')
            .select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({ error: 'Erro ao buscar conexões.' });
    }
});

// Endpoint para adicionar um nome
app.post('/addname', async (req, res) => {
    const { name, instagram } = req.body;
    try {
        const { data, error } = await supabase
            .from('names')
            .insert([{ name, instagram }]);
        if (error) throw error;
        res.json({ success: true, id: data[0].id });
    } catch (error) {
        console.error('Error adding name:', error);
        res.status(500).json({ error: 'Erro ao adicionar nome.' });
    }
});

// Endpoint para criar uma conexão
app.post('/createconnection', async (req, res) => {
    const { name1, name2 } = req.body;
    try {
        const { data, error } = await supabase
            .from('connections')
            .insert([{ name1, name2 }]);
        if (error) throw error;
        res.json({ success: true, message: 'Conexão criada com sucesso!' });
    } catch (error) {
        console.error('Error creating connection:', error);
        res.status(500).json({ error: 'Erro ao criar conexão.' });
    }
});

// Endpoint para buscar conexões por nome
app.post('/getconnections', async (req, res) => {
    const { name } = req.body;
    try {
        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .or(`name1.eq.${name},name2.eq.${name}`);
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({ error: 'Erro ao buscar conexões.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
