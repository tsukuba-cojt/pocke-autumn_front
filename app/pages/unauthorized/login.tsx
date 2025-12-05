import { Header } from "~/components/Header";
import type { Route } from "./+types/login";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "ログイン" },
		{ name: "description", content: "ログインページ" },
	];
}

export default function Login() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-white">
			<div className="flex w-full max-w-sm flex-col px-6">
				<h1 className="mb-10 text-center text-lg font-bold text-black">
					ログイン
				</h1>
				<form className="flex w-full flex-col gap-3">
					{/* Input fields */}
					<input
						type="text"
						className="h-11 w-full rounded-md bg-gray-300 px-4 text-sm text-black"
					/>
					<input
						type="password"
						className="h-11 w-full rounded-md bg-gray-300 px-4 text-sm text-black"
					/>

					{/* OAuth buttons */}
					<button
						type="button"
						className="mt-2 h-11 w-full rounded-md bg-gray-300 text-sm font-medium text-black hover:bg-gray-400"
					>
						Googleでログイン
					</button>
					<button
						type="button"
						className="h-11 w-full rounded-md bg-gray-300 text-sm font-medium text-black hover:bg-gray-400"
					>
						appleでログイン
					</button>
					<button
						type="button"
						className="h-11 w-full rounded-md bg-gray-300 text-sm font-medium text-black hover:bg-gray-400"
					>
						Githubでログイン
					</button>

					{/* Submit button */}
					<button
						type="submit"
						className="mt-8 h-11 w-full rounded-full bg-gray-600 text-sm font-medium text-white hover:bg-gray-700"
					>
						ログイン
					</button>
				</form>
			</div>
		</div>
	);
}
