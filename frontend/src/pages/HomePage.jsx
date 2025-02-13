import CategoryItem from "../components/CategoryItem";

const categories = [
	{ href: "/Sneakersy ", name: "Sneakersy", imageUrl: "/Sneakersy.jpg" },
	{ href: "/Trampki", name: "Trampki", imageUrl: "/Trampki.jpg" },
	{ href: "/Mokasyny", name: "Mokasyny", imageUrl: "/Mokasyny.jpg" },
	{ href: "/Oksfordy", name: "Oksfordy", imageUrl: "/Oksfordy.jpg" },
	{ href: "/Klapki", name: "Klapki", imageUrl: "/Klapki.jpg" },
	{ href: "/Sandały", name: "Sandały", imageUrl: "/Sandały.jpg" },
];

const HomePage = () => {


	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Kategorie butów
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Najnowsze trendy w modzie męskiej i damskiej
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>


			</div>
		</div>
	);
};
export default HomePage;

// const HomePage = () => {
//   return (
//     <div>HomePage</div>
//   )
// }

// export default HomePage