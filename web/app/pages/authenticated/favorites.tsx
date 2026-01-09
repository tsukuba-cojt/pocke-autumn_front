import { Header } from "../../components/Header";
import { useUser } from "../../contexts/UserContext";
import type { Route } from "../../../types/web/app/pages/authenticated/+types/favorites";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "お気に入り" },
		{ name: "description", content: "お気に入り一覧" },
	];
}

export default function Favorites() {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="お気に入り" showBackButton={false} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p>お気に入りのアイテムがここに表示されます。</p>
			</div>
		</div>
	);
}
