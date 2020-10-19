const slugify = require('slugify')

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
    async findAll (req, res) {
        const { userId, from, to, limit } = req.query
    },
    async create (req, res) {

    }
}

module.exports = { fineHandler, users }