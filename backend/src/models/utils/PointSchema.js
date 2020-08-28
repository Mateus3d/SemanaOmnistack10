const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({ //Pego da própria documentação do mongoose, relativo lat e long
    type:{
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates:{
        type: [Number],
        required: true
    }
});

module.exports = PointSchema;