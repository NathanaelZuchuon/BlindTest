export default function Footer() {
	return (
		<footer className="bg-gray-800 text-white py-4 fixed bottom-0 w-full">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center">
					<p className="text-sm">
						© {new Date().getFullYear()} BlindTest Platform. Tous
						droits réservés.
					</p>
					<p className="text-sm mt-2">
						Conçu avec ❤️ par By Zuch pour mon Otaku Family 🤍
					</p>
				</div>
			</div>
		</footer>
	);
}
