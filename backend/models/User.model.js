import mangoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mangoose.Schema({
    name: {
        type: String,
        required: [true, 'Proszę podać imię']
    },
    email: {
        type: String,
        required: [true, 'Proszę podać email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Proszę podać hasło'],
        minlength: [8, `Hasło musi mieć minimum 8 znaków`]
    },
    cartItems:[
        {
            product: {
                type: mangoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            }
        }
    ],
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},
{
    timestamps: true,
}
);

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
       return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next()
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mangoose.model('User', userSchema);

export default User;