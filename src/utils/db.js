const mongoose = require( 'mongoose' );

/*module.exports = () => {
    return mongoose.connect(
        process.env.MONGODB_URI,
        { useNewUrlParser : true }
    )
}*/

module.exports = () => {
    return mongoose.connect(
        'mongodb://localhost:27017/node_server',
        { useNewUrlParser : true }
    )
}
