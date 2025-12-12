import { Header } from "../../../components/Header";
import { useUser } from "../../../contexts/UserContext";
import type { Route } from "./+types/profile";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "プロフィール" },
		{ name: "description", content: "ユーザープロフィール" },
	];
}

export default function Profile() {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="プロフィール" showBackButton={false} />
			<div className="flex-1 px-6 py-6 pt-20">
				<div className="mb-4">
					<h2 className="text-xl font-semibold">ユーザー情報</h2>
					<p className="mt-2">ユーザー情報がここに表示されます。</p>
				</div>
			</div>
		</div>
	);
}
