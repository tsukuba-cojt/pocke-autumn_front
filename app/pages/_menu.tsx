import { Link, Outlet, useLocation } from "react-router";

interface TabItem {
	path: string;
	label: string;
	icon: string;
}

export default function AuthenticatedLayout() {
	const location = useLocation();

	const tabs: TabItem[] = [
		{
			path: "/community",
			label: "ホーム",
			icon: "🏠",
		},
		{
			path: "/notifications",
			label: "通知",
			icon: "🔔",
		},
		{
			path: "/profile",
			label: "プロフィール",
			icon: "👤",
		},
	];

	const isActive = (path: string) => {
		return location.pathname.startsWith(path);
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* メインコンテンツエリア - 下部ナビゲーションバーの高さ分のパディングを追加 */}
			<main className="flex-1 pb-16">
				<Outlet />
			</main>

			{/* 下部ナビゲーションバー */}
			<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
				<div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
					{tabs.map((tab) => {
						const active = isActive(tab.path);
						return (
							<Link
								key={tab.path}
								to={tab.path}
								className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
									active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
								}`}
							>
								<span className="text-2xl mb-1">{tab.icon}</span>
								<span className="text-xs font-medium">{tab.label}</span>
							</Link>
						);
					})}
				</div>
			</nav>
		</div>
	);
}
