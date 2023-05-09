const mongoose = require('mongoose');

exports.bootstrap = async () => {
    let connectionString = `${process.env.DATABASE_CONNECTION}`;
    try {
            return await mongoose.connect(connectionString, {
                dbName: process.env.DATABASE_NAME,
                autoIndex: true,
            });
    } catch (e) {
        console.log('----- E ------', e);
        throw new Error('Database is not connect on given string >> ' + connectionString);
    }
};