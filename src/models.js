const mongoose = require('mongoose')
const { nanoid } = require('nanoid')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        unique: true
    },
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }]
})

const exerciseSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    }
})

const UserModel = mongoose.model('User', userSchema)

const ExerciseModel = mongoose.model('Exercise', exerciseSchema)

module.exports = {
    UserModel,
    ExerciseModel
}