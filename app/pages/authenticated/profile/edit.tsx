import { Header } from "../../../components/Header";
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
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="プロフィール編集" showBackButton={true} />
			<div className="flex-1 px-6 py-6 pt-20">
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
		</div>
	);
}
