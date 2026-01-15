import { useNavigate } from "react-router";
import { Header } from "../../../components/Header";
import type { Route } from "../../../../types/app/pages/authenticated/community/+types/[communityId]";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "コミュニティ" },
		{ name: "description", content: "コミュニティ詳細ページ" },
	];
}

// Mock member data - replace with real data later
const mockMembers = [
	{ id: "1", name: "jsys24", avatar: null },
	{ id: "2", name: "user2", avatar: null },
	{ id: "3", name: "user3", avatar: null },
];

export default function CommunityDetail({ params }: Route.ComponentProps) {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header title="コミュニティ" showBackButton={true} />

			<div className="flex-1 px-6 py-6 pt-20">
				{/* Action Buttons */}
				<div className="flex gap-4 mb-6">
					<button
						type="button"
						onClick={() =>
							navigate(`/community/${params.communityId}/settings`)
						}
						className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-full text-base font-medium hover:bg-gray-600 transition-colors"
					>
						編集
					</button>
					<button
						type="button"
						onClick={() => navigate(`/community/${params.communityId}/addList`)}
						className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-full text-base font-medium hover:bg-gray-600 transition-colors"
					>
						参加/作成
					</button>
				</div>

				{/* Member List */}
				<div className="space-y-4">
					{mockMembers.map((member) => (
						<div
							key={member.id}
							className="flex items-center gap-4 p-4 border border-gray-300 rounded-2xl"
						>
							{/* Avatar */}
							<div className="w-32 h-24 bg-gray-300 rounded-lg shrink-0" />

							{/* Member Name */}
							<div className="flex-1">
								<p className="text-lg font-medium text-gray-900">
									{member.name}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
