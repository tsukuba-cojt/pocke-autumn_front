import type { Route } from "../+types/register";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "新規登録" },
		{ name: "description", content: "新規登録ページ" },
	];
}

export default function Register() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">新規登録</h1>
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
					<label htmlFor="email" className="block mb-2">
						メールアドレス
					</label>
					<input
						type="email"
						id="email"
						className="w-full border p-2 rounded"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="password" className="block mb-2">
						パスワード
					</label>
					<input
						type="password"
						id="password"
						className="w-full border p-2 rounded"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					登録
				</button>
			</form>
		</div>
	);
}
