import { useUser } from "../../../contexts/UserContext";
import type { Route } from "./+types/addItem";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "アイテム追加" },
		{ name: "description", content: "新しいアイテムを追加" },
	];
}

export default function AddItem({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">アイテム追加</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {user?.userId}</p>
			<p className="text-gray-600">コミュニティID: {params.communityId}</p>
			<form className="mt-4 max-w-md">
				<div className="mb-4">
					<label htmlFor="name" className="block mb-2">
						アイテム名
					</label>
					<input type="text" id="name" className="w-full border p-2 rounded" />
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
					追加
				</button>
			</form>
		</div>
	);
}
