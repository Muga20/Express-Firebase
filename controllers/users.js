'use strict';

const firebase = require('../config/db');
const User = require('../models/users');
const firestore = firebase.firestore();



const getAllUsers = async (req, res, next) => {
    try {
        const users = await firestore.collection('users');
        const data = await users.get();
        const usersArray = [];
        if(data.empty) {
            res.status(404).send('No User record found');
        }else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().name,
                    doc.data().age,
                    doc.data().phone,
                    doc.data().email,
                    doc.data().password,
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUsersId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const users = await firestore.collection('users').doc(id);
        const data = await users.get();
        if(!data.exists) {
            res.status(404).send('Users with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUsers = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const users =  await firestore.collection('users').doc(id);
        await users.update(data);
        res.send('Users record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUsers = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('users').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {

    getAllUsers,
    getUsersId,
    updateUsers,
    deleteUsers
}





