import { Header } from "../../../../components/Header";
import { useUser } from "../../../../contexts/UserContext";
import type { Route } from "../../../../../types/web/app/pages/authenticated/community/[itemId]/+types/thread";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "スレッド" },
		{ name: "description", content: "アイテムのスレッドページ" },
	];
}

export default function ItemThread({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="スレッド" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p>アイテムに関するスレッド・コメントがここに表示されます。</p>
			</div>
		</div>
	);
}
