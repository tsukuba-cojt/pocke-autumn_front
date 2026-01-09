import { Header } from "../../../../components/Header";
import { useUser } from "../../../../contexts/UserContext";
import type { Route } from "../../../../../types/web/app/pages/authenticated/community/[communityId]/+types/member";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "メンバー管理" },
		{ name: "description", content: "コミュニティメンバー管理ページ" },
	];
}

export default function CommunityMember({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="メンバー管理" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p>コミュニティのメンバー一覧がここに表示されます。</p>
			</div>
		</div>
	);
}
