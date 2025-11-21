import type { Route } from "./+types/favorites";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "お気に入り" },
		{ name: "description", content: "お気に入り一覧" },
	];
}

export default function Favorites({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">お気に入り</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<div className="mt-4">
				<p>お気に入りのアイテムがここに表示されます。</p>
			</div>
		</div>
	);
}
