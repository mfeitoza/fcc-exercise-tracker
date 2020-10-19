const { validationResult } = require('express-validator')

class ErrorHandler extends Error {
    constructor (status, message) {
        super()
        this.status = status
        this.message = message
    }
}

function handleError (err, res) {
    const { status, message } = err

    res.status(status).json({
        status: 'error',
        statusCode: status,
        message
    })
}

module.exports = {
    ErrorHandler,
    handleError
}