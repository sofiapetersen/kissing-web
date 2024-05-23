const { createClient } = require('@supabase/supabase-js');

// Substitua esses valores pelos seus do Supabase
const supabaseUrl = 'https://pygqirmwmklcmhbgflgp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5Z3Fpcm13bWtsY21oYmdmbGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0ODU2NzcsImV4cCI6MjAzMjA2MTY3N30.XwgiRamAuySwqx6EvvWam8i9_EvG4aW2PUTEXeMZWfQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Exemplo de endpoint para obter todas as conexões
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

// Exemplo de endpoint para adicionar um nome
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

// Exemplo de endpoint para criar uma conexão
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

// Exemplo de endpoint para buscar conexões por nome
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
