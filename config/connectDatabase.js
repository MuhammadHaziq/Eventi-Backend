const mongoose = require('mongoose');

exports.bootstrap = async () => {
    let connectionString = `mongodb://${('127.0.0.1')}:27017`;
    try {
            return await mongoose.connect(connectionString, {
                dbName: process.env.DATABASE_NAME,
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });
    } catch (e) {
        console.log('----- E ------', e);
        throw new Error('Database is not connect on given string >> ' + connectionString);
    }
};