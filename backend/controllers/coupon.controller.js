import Coupon from "../models/Coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		res.json(coupon || null);
	} catch (error) {
		console.log("Błąd w dostaniu kuponu", error);
		res.status(500).json({ message: "Server error"});
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Kupon nie znaleziony" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Kupon wygasł" });
		}

		res.json({
			message: "Kupon zaakceptowany",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Błąd podczas sprawdzania kuponow", error);
		res.status(500).json({ message: "Server error"});
	}
};