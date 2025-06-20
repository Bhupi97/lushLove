const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["like", "pass", "accepted", "rejected"],
            message: `{VALUE} is invalid status`
        }
    }
},
{timestamps: true}
);

connectionRequestSchema.index({sender: 1, receiver: 1})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);