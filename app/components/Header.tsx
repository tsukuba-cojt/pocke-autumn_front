import { useNavigate } from "react-router";

interface HeaderProps {
	title: string;
	showBackButton?: boolean;
}

export function Header({ title, showBackButton = false }: HeaderProps) {
	const navigate = useNavigate();

	return (
		<header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white">
			<div className="relative flex h-14 items-center justify-center px-4">
				{showBackButton && (
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="absolute left-4 flex h-8 w-8 items-center justify-center text-gray-700 hover:text-gray-900"
						aria-label="戻る"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="h-6 w-6"
							role="img"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>
				)}
				<h1 className="text-lg font-bold text-black">{title}</h1>
			</div>
		</header>
	);
}
