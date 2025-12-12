import { Header } from "../../../../components/Header";
import { useUser } from "../../../../contexts/UserContext";
import type { Route } from "./+types/addList";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "リスト追加" },
		{ name: "description", content: "新しいリストを追加" },
	];
}

export default function AddList({ params }: Route.ComponentProps) {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="リスト追加" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
				<form className="mt-4 max-w-md">
					<div className="mb-4">
						<label htmlFor="name" className="block mb-2">
							リスト名
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
						追加
					</button>
				</form>
			</div>
		</div>
	);
}
