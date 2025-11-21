import type { Route } from "./+types/[listId]";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "リスト詳細" },
		{ name: "description", content: "リスト詳細ページ" },
	];
}

export default function ListDetail({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">リスト詳細</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<p className="text-gray-600">コミュニティID: {params.communityId}</p>
			<p className="text-gray-600">リストID: {params.listId}</p>
			<div className="mt-4">
				<p>リスト内のアイテムがここに表示されます。</p>
			</div>
		</div>
	);
}
