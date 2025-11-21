import type { Route } from "./+types/community";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "コミュニティ一覧" },
		{ name: "description", content: "コミュニティ一覧ページ" },
	];
}

export default function Community({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">コミュニティ一覧</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<div className="mt-4">
				<p>参加中のコミュニティがここに表示されます。</p>
			</div>
		</div>
	);
}
