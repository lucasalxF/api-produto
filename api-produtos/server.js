const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/produtosDB');

app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Produtos!');
});

const produtoSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
    descricao: String,
    estoque: Number,
});

const Produto = mongoose.model('Produto', produtoSchema);


app.post('/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).send(novoProduto);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).send(produtos);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await Produto.findById(id);
        if (!produto) {
            return res.status(404).send();
        }
        res.status(200).send(produto);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await Produto.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!produto) {
            return res.status(404).send();
        }
        res.status(200).send(produto);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await Produto.findByIdAndDelete(id);
        if (!produto) {
            return res.status(404).send();
        }
        res.status(200).send(produto);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
