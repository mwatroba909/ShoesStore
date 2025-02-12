import { redis } from '../library/redis.js';
import cloudinary from '../library/cloudinary.js';
import Product from '../models/Product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

export const getRecommendationProducts = async (req, res) => {
    try {
        let receomendationProducts = await redis.get('recommendationProducts');
        if(receomendationProducts) {
            res.json({products: JSON.parse(receomendationProducts)});
        }

        receomendationProducts = await Product.find({isRecommended: true}).lean();

        if(!receomendationProducts) {
            return res.status(404).json({message: 'Brak rekomendacji'});
        }

        await redis.set('recommendationProducts', JSON.stringify(receomendationProducts));

        res.json({products: receomendationProducts});
    } catch {
        res.status(500).json({message: 'Server error'});
    }
} 

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, image} = req.body;

        let cloudinaryResposne = null

        if(image) {
            cloudinaryResposne = await cloudinary.uploader.upload(image,{folder: "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResposne.secure_url ? cloudinaryResposne.secure_url : '',
            category,
        });

        
        res.status(201).json({product, message: 'Produkt dodany'});
    } catch {
        res.status(500).json({message: 'Server error'});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({message: 'Produkt nie znaleziony'});
        }

        if(product.image) {
            const publicId = product.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log('obrazek usuniety z cloudinary');


            } catch (error) {
                console.log("Błąd usuwania obrazka z cloudinary", error);
            }
        }

        res.json({message: 'Produkt usunięty'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json({products});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

export const changeRemomendationProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        if( product)
        {
            product.isRecommended = !product.isRecommended;
            const updatedProduct = await product.save();
            await updatedRecommendationProductscashe();

            resj.json(updatedProduct)
        } else (
            res.status(404).json({message: 'Produkt nie znaleziony'})
        )
    } catch (error) {
        console.log("error in changeRemomendationProduct", error.message);
        res.status(500).json({message: error.message});
    }
}

async function updatedRecommendationProductscashe() {
    try {
        const receomendationProducts = await Product.find({isRecommended: true}).lean();
        await redis.set("recommendationProducts", JSON.stringify(receomendationProducts));
    } catch (error) {
        console.log("error in updatedRecommendationProductscashe", error.message);
    }
}