import type { Route } from "./+types/[communityId]";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "コミュニティ詳細" },
		{ name: "description", content: "コミュニティ詳細ページ" },
	];
}

export default function CommunityDetail({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">コミュニティ詳細</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<p className="text-gray-600">コミュニティID: {params.communityId}</p>
			<div className="mt-4">
				<p>コミュニティの詳細情報がここに表示されます。</p>
			</div>
		</div>
	);
}
