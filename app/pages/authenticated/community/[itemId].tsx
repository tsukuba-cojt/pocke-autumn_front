import { Header } from "../../../components/Header";
import { useUser } from "../../../contexts/UserContext";
import type { Route } from "./+types/[itemId]";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "アイテム詳細" },
		{ name: "description", content: "アイテム詳細ページ" },
	];
}

export default function ItemDetail({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="アイテム詳細" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p>アイテムの詳細情報がここに表示されます。</p>
			</div>
		</div>
	);
}
