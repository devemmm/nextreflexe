const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Emmanuel:Emmanuel@dj12345@emmanuel.haizz.mongodb.net/reflexology?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        return console.log("Connected To Database")
    })
    .catch(() => {
        return console.log("Unable to Connect To Database try Again")
    })