const express = require('express'); //Var com os poderes do express, ele importa o q tá no node_modules
const mongoose = require('mongoose'); //Var com os poderes do mongodb
const cors = require('cors'); //Pra poder linkar o front com o backend
const http = require('http');
const routes = require('./routes'); //Importa o routes.js
const { setupWebSocket } = require('./websocket'); //O webSocket vai mandar dados em tempo real

const app = express();
const server = http.Server(app);

setupWebSocket(server);

//Pra conectar no DB com a stringConnect
mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-ny3ll.mongodb.net/week10?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true 
});
 
app.use(cors()); 
app.use(express.json());
app.use(routes);
//Métodos HTTP:
//get => receber informação, post => criar informação
//put => editar um recurso, delete => deleta

//Tipos de parametros
//Query params: request.query (filtros, ordenação, paginação)
//Route params> reuquest.params (Identificar um recurço na alteração ou remoção)
//Body: request.body (Dados para criação ou alteração de um registro)
/*
app.get('/users', (request,response) => { //() => {} é uma função
    console.log(request.query);
    return response.json({message: 'Hello rapaziada!'}); //Json é o formato da resposta do servidor
});*/
/*
app.delete('/users/:id', (request,response) => { //() => {} é uma função
    console.log(request.params);
    return response.json({message: 'Hello rapaziada!'}); //Json é o formato da resposta do servidor
});*/
/*
app.post('/users', (request,response) => { //() => {} é uma função
    console.log(request.body);
    return response.json({message: 'Hello rapaziada!'}); //Json é o formato da resposta do servidor
});*/
server.listen(3333); //Define a porta de localhost

