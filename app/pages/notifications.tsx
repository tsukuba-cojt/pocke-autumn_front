import type { Route } from "./+types/notifications";

export function meta(_args: Route.MetaArgs) {
	return [{ title: "通知" }, { name: "description", content: "通知一覧" }];
}

export default function Notifications({ params }: Route.ComponentProps) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">通知</h1>
			<p className="mt-2 text-gray-600">ユーザーID: {params.userId}</p>
			<div className="mt-4">
				<p>通知がここに表示されます。</p>
			</div>
		</div>
	);
}
