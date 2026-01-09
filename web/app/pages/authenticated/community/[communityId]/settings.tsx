import { Header } from "../../../../components/Header";
import { useUser } from "../../../../contexts/UserContext";
import type { Route } from "../../../../../types/web/app/pages/authenticated/community/[communityId]/+types/settings";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "コミュニティ設定" },
		{ name: "description", content: "コミュニティ設定ページ" },
	];
}

export default function CommunitySettings({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="コミュニティ設定" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
				<form className="mt-4 max-w-md">
					<div className="mb-4">
						<label htmlFor="name" className="block mb-2">
							コミュニティ名
						</label>
						<input
							type="text"
							id="name"
							className="w-full border p-2 rounded"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="description" className="block mb-2">
							説明
						</label>
						<textarea
							id="description"
							className="w-full border p-2 rounded"
							rows={4}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						保存
					</button>
				</form>
			</div>
		</div>
	);
}
