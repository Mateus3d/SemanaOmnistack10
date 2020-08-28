const axios = require('axios'); //Pra pegar a api do github
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request,response) {
        const devs = await Dev.find(); //Lança todo mundo

        return response.json(devs);
    },

    async store(request,response) {  //() => {} é uma função //store é o nome dessa função
        //console.log(request.body);
        const {github_username, techs, latitude, longitude} = request.body; //const { }, desestruturação, vai pegar esses valores direto do corpo da requisição

        let dev = await Dev.findOne({github_username}); //Pra evitar duplicidade
        if(!dev)
        {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`); //async await, pra esperar o github responder
            const {name = login, avatar_url, bio} = apiResponse.data; //o default, caso name seja null é login
            //console.log("nome: ",name,"AvatarUrl: ",avatar_url,bio);
            const techsArray = parseStringAsArray(techs);//Pra pegar o string enviado pelo request e montar um array (sem espaços)    return response.json({message: 'Hello rapaziada!'}); //Json é o formato da resposta do servidor

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
            
            //Filtrar as conexões q estão a no máximo a 10km de distância
            //e q o novo Dev tenha pelo menos uma das techs filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    },

    async update() { //Atualizar informações, exceto o userName

    },
    async destroy() { //Deletar um dev

    }
};