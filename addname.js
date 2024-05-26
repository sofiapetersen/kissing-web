const supabase = require('./client');

// Endpoint para adicionar nome
app.post('/addname', async (req, res) => {
    const { name, instagram } = req.body;
    try {
        const { data, error } = await supabase
            .from('names')
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