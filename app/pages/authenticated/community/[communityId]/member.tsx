import { useUser } from "../../../../contexts/UserContext";
import type { Route } from "./+types/member";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "メンバー管理" },
		{ name: "description", content: "コミュニティメンバー管理ページ" },
	];
}

export default function CommunityMember({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">メンバー管理</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {user?.userId}</p>
			<p className="text-gray-600">コミュニティID: {params.communityId}</p>
			<div className="mt-4">
				<p>コミュニティのメンバー一覧がここに表示されます。</p>
			</div>
		</div>
	);
}
