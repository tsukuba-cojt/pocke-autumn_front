import { Header } from "../../components/Header";
import type { Route } from "./+types/_menu.home";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "ホーム" },
		{ name: "description", content: "ホームページ" },
	];
}

export default function Home() {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="ホーム" showBackButton={false} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p className="mt-4">ホームページへようこそ</p>
			</div>
		</div>
	);
}
