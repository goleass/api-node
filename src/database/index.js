const mongoose = require('mongoose')




const dbUrl = 'mongodb://localhost/noderest'

const options = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
mongoose.connect(dbUrl, options)
    .then(() => console.log('DB connected'))
    .catch(err => {
        console.log('DB Connection Error: ' + err);
    });

mongoose.Promise = global.Promise
module.exports = mongoose
