import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../stores/useCart";
import axios from "../api/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {

	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCart();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payments/checkout_succes", {
					sessionId,
				});
				clearCart();
			} catch (error) {
				console.log(error);
			} finally {
				setIsProcessing(false);
			}
		};

	const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("Nie znaleziono ID sesji w adresie URL");
		}
	}, [clearCart]);

	if (isProcessing) return "Przetwarzanie...";

	if (error) return `Error: ${error}`;


    return (
		<div className='h-screen flex items-center justify-center px-4'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
		/>
			<div className='h-screen flex items-center justify-center px-4'>
				<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
					<div className='p-6 sm:p-8'>
						<div className='flex justify-center'>
							<CheckCircle className='text-purple-400 w-16 h-16 mb-4' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-bold text-center text-purple-400 mb-2'>
							Zakup zakończony sukcesem!
						</h1>

						<p className='text-gray-300 text-center mb-2'>
							Dziekujemy za zamowienie.
						</p>
						<p className='text-purple-400 text-center text-sm mb-6'>
							Sprawdz swoj e-mail po wiecej informacji.
						</p>
						<div className='bg-gray-700 rounded-lg p-4 mb-6'>
							<div className='flex items-center justify-between mb-2'>
								<span className='text-sm text-gray-400'>Numer zamowienia</span>
								<span className='text-sm font-semibold text-purple-400'>#12345</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-gray-400'>Szacowany czas przesyłki</span>
								<span className='text-sm font-semibold text-purple-400'>3-5 dni roboczych</span>
							</div>
						</div>

						<div className='space-y-4'>
							<button
								className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4
								rounded-lg transition duration-300 flex items-center justify-center'
							>
								<HandHeart className='mr-2' size={18} />
								Dziekujemy za zaufanie!
							</button>
							<Link
								to={"/"}
								className='w-full bg-gray-700 hover:bg-gray-600 text-purple-400 font-bold py-2 px-4 
								rounded-lg transition duration-300 flex items-center justify-center'
							>
								Kontynuj zakupy 
								<ArrowRight className='ml-2' size={18} />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;