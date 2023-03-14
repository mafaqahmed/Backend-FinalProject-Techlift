const mongoose = require('mongoose');

const validateMongoDbId = (id) => {
    const valid = mongoose.Types.ObjectId.isValid(id);
    if(!valid){
        throw new Error('This id is not valid or not Found')
    }
}

module.exports = validateMongoDbId;