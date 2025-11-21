import type { Route } from "./+types/[itemId]";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "アイテム詳細" },
		{ name: "description", content: "アイテム詳細ページ" },
	];
}

export default function ItemDetail({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">アイテム詳細</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<p className="text-gray-600">コミュニティID: {params.communityId}</p>
			<p className="text-gray-600">リストID: {params.listId}</p>
			<p className="text-gray-600">アイテムID: {params.itemId}</p>
			<div className="mt-4">
				<p>アイテムの詳細情報がここに表示されます。</p>
			</div>
		</div>
	);
}
