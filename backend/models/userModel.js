import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    isAdmin: {
        type: Boolean, 
        required: true,
        default: false
    },
}, {
    timestamps: true
})

// Note: For methods inside a MongoDB database schema, we must only use the normal function keyword when creating a function and not use a lambda function - otherwise there would be an error.
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Before the schema is saved we run the async function passwed into the argument.
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema);

export default User;