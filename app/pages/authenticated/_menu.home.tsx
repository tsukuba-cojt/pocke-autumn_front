import type { Route } from "./+types/_menu.home";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "ホーム" },
		{ name: "description", content: "ホームページ" },
	];
}

export default function Home() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">ホーム</h1>
			<p className="mt-4">ホームページへようこそ</p>
		</div>
	);
}
