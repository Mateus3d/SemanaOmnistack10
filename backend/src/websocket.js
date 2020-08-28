const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const  connections = []; //nosso "BD" de usuários conectados no momento

exports.setupWebSocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => { //Sempre q houver uma nova conecção ele vai entrar nesse método On
        /*console.log(socket.id);
        console.log(socket.handshake.query); //Os parametros enviados do front-end caem nessa variável*/
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),

        }); 
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
            //Tá verificando se a distância é menor q 10km e se
            //os conectados tem pelo menos uma das techs (some)
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
}