const express = require('express');

const {
    getAllUsers,
    getUsersId,
    updateUsers
} = require('../controllers/users');

const {
    logInUsers,
    registerUsers,
} = require('../auth/auth.js');


const UserRouter = express.Router();

UserRouter.get('/', getAllUsers);
UserRouter.get('/:id', getUsersId);
UserRouter.put('/:id', updateUsers);
UserRouter.post('/register', registerUsers);
UserRouter.post('/login', logInUsers);

module.exports = UserRouter;
