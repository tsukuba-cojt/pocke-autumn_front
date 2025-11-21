import type { Route } from "./+types/profile";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "プロフィール" },
		{ name: "description", content: "ユーザープロフィール" },
	];
}

export default function Profile({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">プロフィール</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<div className="mt-4">
				<div className="mb-4">
					<h2 className="text-xl font-semibold">ユーザー情報</h2>
					<p className="mt-2">ユーザー情報がここに表示されます。</p>
				</div>
			</div>
		</div>
	);
}
