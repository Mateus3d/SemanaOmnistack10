//Pra importar algo específico do express, se quisesse tudo fazia const express = require('express')
const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs',DevController.index); //Pega toos os dev
routes.post('/devs', DevController.store); //Cadastra
routes.get('/search', SearchController.index); //Busca


module.exports = routes; //Exportando a var routes pra fora, pra ser acessado pelo index.js