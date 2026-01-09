import { Header } from "../../components/Header";
import { useUser } from "../../contexts/UserContext";
import type { Route } from "../../../types/web/app/pages/authenticated/+types/notifications";

export function meta(_args: Route.MetaArgs) {
	return [{ title: "通知" }, { name: "description", content: "通知一覧" }];
}

export default function Notifications() {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="通知" showBackButton={false} />
			<div className="flex-1 px-6 py-6 pt-20">
				<p>通知がここに表示されます。</p>
			</div>
		</div>
	);
}
