const mongoose = require('mongoose');

exports.bootstrap = async () => {
    let connectionString = process.env.MONDO_DB_URL;

    if (!connectionString) {
        connectionString = `mongodb://${('127.0.0.1')}:27017`;
    }
    try {
        if (process.env.PRODUCTION) {
            return await mongoose.connect(connectionString, {
                dbName: "account",
                user: "root",
                pass: "Compliance123",
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });
        } else {
            return await mongoose.connect(connectionString, {
                dbName: "account",
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });
        }
    } catch (e) {
        console.log('----- E ------', e);
        throw new Error('Database is not connect on given string >> ' + connectionString);
    }
};