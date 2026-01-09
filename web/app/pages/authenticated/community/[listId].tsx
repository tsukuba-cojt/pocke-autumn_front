import { Header } from "../../../components/Header";
import { useUser } from "../../../contexts/UserContext";
import type { Route } from "../../../../types/web/app/pages/authenticated/community/+types/[listId]";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "リスト詳細" },
		{ name: "description", content: "リスト詳細ページ" },
	];
}

export default function ListDetail({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="リスト詳細" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p>リスト内のアイテムがここに表示されます。</p>
			</div>
		</div>
	);
}
