const {databaseConnect, databaseDisconnect} = require("./database")
const {User} = require('./models/UserModel')
require('dotenv').config();

databaseConnect().then(async() => {
    console.log('creating seed data!')
    //users
    let newUser1 = await User.create({
        fname: 'admin',
        lname: 'test',
        email: 'admin@email.com',
        password: 'admin',
        auth: 'admin'
    });

    let newUser2 = await User.create({
        fname: 'manager',
        lname: 'test',
        email: 'manager@email.com',
        password: 'manager',
        auth: 'manager'
    })
}).then(async () => {
    databaseDisconnect()
})
