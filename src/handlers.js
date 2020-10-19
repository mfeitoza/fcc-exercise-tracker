const slugify = require('slugify')
const { body, validationResult } = require('express-validator')
const parse = require('date-fns/parse')
const mongoose = require('mongoose')

const { ErrorHandler } = require('./error')
const { UserModel, ExerciseModel } = require('./models')

async function fineHandler(req, res) {
    res.json({ text: 'Fine' })
}

const users = {
    async findAll (req, res) {
        const allUsers = await UserModel.find()
        res.json(allUsers)
    },
    async create (req, res, next) {
        try {
            let username = req.body.username
            if (username) {
                username = slugify(username)

                const userExist = await UserModel.findOne({ username })
                if (userExist) {
                    throw new ErrorHandler(400, 'username already taken!')
                }
                const newUser = new UserModel({ username })
                const savedUser = await newUser.save()
                res.json(savedUser)
            }
        } catch (error) {
            next(error)
        }
    }
}

const exercises = {
    async findAll (req, res, next) {
        let { userId, from, to, limit } = req.query
        const data = {}

        const user = await UserModel.findOne({ _id: userId })
        try {
            if (user) {
                const query = ExerciseModel.find({ username: user.username })
                if (from) {
                    from = parse(from, 'yyyy-MM-dd', new Date())
                    query.where('date').gte(from)
                }
                if (to) {
                    to = parse(to, 'yyyy-MM-dd', new Date())
                    query.where('date').lte(to)
                }
                if (limit) {
                    query.limit(Number(limit))
                }

                const exercises = await query.exec()

                data._id = user._id
                data.username = user.username
                data.count = user.exercises.length
                data.log = exercises
                
                res.json(data)
            } else {
            throw new ErrorHandler(404, `User not found.`)
            }
        } catch (error) {
            next(error)
        }
    },
    async create (req, res, next) {
        try {
            const { errors } = validationResult(req)
            
            if (errors.length > 0) {
                throw new ErrorHandler(400, errors)
            }
            let { userId, description, duration, date } = req.body
            
            const user = await UserModel.findById(userId)

            if (user) {
                date = date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date(Date.now())

                const newExercise = new ExerciseModel({ username: user.username, description, duration, date })
                const savedExercise = await newExercise.save()

                user.exercises.push(savedExercise._id)
                user.save()

                res.json({
                    _id: user._id,
                    username: savedExercise.username,
                    description: savedExercise.description,
                    duration: savedExercise.duration,
                    date: savedExercise.date.toDateString()
                })
            } else {
                throw new ErrorHandler(404, `User not found.`)
            }        
        } catch (error) {
            next(error)
        }
    },
    createValidation () {
        return [
            body('userId').isString().not().isEmpty(),
            body('description').isString().not().isEmpty()
        ]
    }
}

module.exports = { fineHandler, users, exercises }