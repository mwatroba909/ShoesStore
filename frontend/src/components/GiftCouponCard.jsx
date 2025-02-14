import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "../stores/useCart";

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCart();

    useEffect(() => {
        getMyCoupon();
    }, [getMyCoupon]);

    useEffect(() => {
        if (coupon) setUserInputCode(coupon.code);
    }, [coupon]);

    const handleApplyCoupon = () => {
        if (!userInputCode) return;
        applyCoupon(userInputCode);
		console.log("Kupon dodany");
	};

    const handleRemoveCoupon = async () => {
        await removeCoupon();
        setUserInputCode("");
		console.log("Kupon usuniety");
	};

    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className='space-y-4'>
                <div>
                    <label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
                        Kod Promocyjny:
                    </label>
                    <input
                        type='text'
                        id='voucher'
                        className='block w-full rounded-lg border border-gray-600 bg-gray-700 
                        p-2.5 text-sm text-white placeholder-gray-400 focus:border-purple-500 
                        focus:ring-purple-500'
                        placeholder='Wpisz kod tutaj'
                        value={userInputCode}
                        onChange={(e) => setUserInputCode(e.target.value)}
                        required
                    />
                </div>

                <motion.button
                    type='button'
                    className='flex w-full items-center justify-center rounded-lg bg-purple-600 
                    px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 
                    focus:outline-none focus:ring-4 focus:ring-purple-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyCoupon}
                >
                    Dodaj Kupon
                </motion.button>
            </div>
            {isCouponApplied && coupon && (
                <div className='mt-4'>
                    <h3 className='text-lg font-medium text-gray-300'>
                        Kupon zaakceptowany
                    </h3>
                    <p className='mt-2 text-sm text-gray-400'>
                        {coupon.code} - {coupon.discountPercentage}% zniżki
                    </p>
                    <motion.button
                        type='button'
                        className='mt-2 flex w-full items-center justify-center rounded-lg 
                        bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 
                        focus:outline-none focus:ring-4 focus:ring-red-300'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveCoupon}
                    >
                        Usuń Kupon
                    </motion.button>
                </div>
            )}

            {coupon && (
                <div className='mt-4'>
                    <h3 className='text-lg font-medium text-gray-300'>
                        Twój aktualny Kupon:
                    </h3>
                    <p className='mt-2 text-sm text-gray-400'>
                        {coupon.code} - {coupon.discountPercentage}% zniżki
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default GiftCouponCard;