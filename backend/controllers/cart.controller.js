import e from "express";

export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({productId});
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Błąd dodawania produktu do koszyka", error);
        res.status(500).json({message: 'Server error'});
    }
}

export const deleteAllFromCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Błąd usuwania produktu z koszyka", error);
        res.status(500).json({message: 'Server error'});
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.id === productId);
    } catch (error) {
        
    }
}