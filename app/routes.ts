import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
	// ホームページ
	index("pages/home.tsx"),

	// 認証関連
	route("login", "pages/login.tsx"),
	route("register", "pages/register.tsx"),

	// コミュニティ関連
	route(":userId/community", "pages/community.tsx"),
	route(":userId/community/addCommunity", "pages/community/addCommunity.tsx"),
	route(":userId/community/:communityId", "pages/community/[communityId].tsx"),
	route(
		":userId/community/:communityId/member",
		"pages/community/[communityId]/member.tsx",
	),
	route(
		":userId/community/:communityId/settings",
		"pages/community/[communityId]/settings.tsx",
	),
	route(
		":userId/community/:communityId/addList",
		"pages/community/[communityId]/addList.tsx",
	),
	route(
		":userId/community/:communityId/:listId",
		"pages/community/[listId].tsx",
	),
	route(
		":userId/community/:communityId/:listId/:itemId",
		"pages/community/[itemId].tsx",
	),
	route(
		":userId/community/:communityId/:listId/:itemId/thread",
		"pages/community/[itemId]/thread.tsx",
	),
	route(
		":userId/community/:communityId/addItem",
		"pages/community/addItem.tsx",
	),

	// ユーザープロフィール
	route(":userId/profile", "pages/profile.tsx"),
	route(":userId/profile/edit", "pages/profile/edit.tsx"),
	route(":userId/favorites", "pages/favorites.tsx"),

	// 通知画面
	route(":userId/notifications", "pages/notifications.tsx"),
] satisfies RouteConfig;
