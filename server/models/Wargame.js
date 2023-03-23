const mongoose = require("mongoose")


const wargameSchema = new mongoose.Schema(
    {
        createdby: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        hosters: [{
            type: String,
            require: true,
        }],
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        location: { 
            type: String,
            required: true
        },
        joule: {
            type: String,
            required: true
        },
        maxpeople: {
            type: Number,
            min: 5,
            max: 100,
            required: true
        },
        joined: [{
            type: String,
            required: true
        }],
        allow: [{
            type: String,
            required: true
        }],
        deny: [{
            type: String,
            required: true
        }],
        price: {
            type: String,
            required: true
        },
        studentprice: {
            type: String,
            required: true
        },
        rentgear: {
            type: Number,
            min: 20,
            max: 300
        },
        gamemode: [{
            type: String,
            required: true
        }],
        public: {
            type: Boolean,
            default: true
        },
        password: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        }
    
},
{
    timestamps: true
}
)


module.exports = mongoose.model('Wargame', wargameSchema)