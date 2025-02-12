import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Proszę podać nazwę produktu']
    },
    description: {
        type: String,
        required: [true, 'Proszę podać opis produktu']
    }, 
    price: {
        type: Number,
        required: [true, 'Proszę podać cenę produktu']
    },
    image: {
        type: String,
        required: [true, 'Proszę podać zdjęcie produktu']
    },
    category: {
        type: String,
        required: [true, 'Proszę podać kategorię produktu']
    },
    isRecommended: {
        type: Boolean,
        default: false
    },
},{ timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;