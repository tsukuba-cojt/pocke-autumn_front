import { useUser } from "../../../contexts/UserContext";
import type { Route } from "./+types/edit";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "プロフィール編集" },
		{ name: "description", content: "プロフィール編集ページ" },
	];
}

export default function ProfileEdit() {
	const { user } = useUser();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">プロフィール編集</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {user?.userId}</p>
			<form className="mt-4 max-w-md">
				<div className="mb-4">
					<label htmlFor="username" className="block mb-2">
						ユーザー名
					</label>
					<input
						type="text"
						id="username"
						className="w-full border p-2 rounded"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="bio" className="block mb-2">
						自己紹介
					</label>
					<textarea id="bio" className="w-full border p-2 rounded" rows={4} />
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					保存
				</button>
			</form>
		</div>
	);
}
