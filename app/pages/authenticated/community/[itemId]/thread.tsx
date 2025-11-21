import { useUser } from "../../../../contexts/UserContext";
import type { Route } from "./+types/thread";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "スレッド" },
		{ name: "description", content: "アイテムのスレッドページ" },
	];
}

export default function ItemThread({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">スレッド</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {user?.userId}</p>
			<p className="text-gray-600">コミュニティID: {params.communityId}</p>
			<p className="text-gray-600">リストID: {params.listId}</p>
			<p className="text-gray-600">アイテムID: {params.itemId}</p>
			<div className="mt-4">
				<p>アイテムに関するスレッド・コメントがここに表示されます。</p>
			</div>
		</div>
	);
}
