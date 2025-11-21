import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
	// ホームページ
	index("routes/home.tsx"),

	// 認証関連
	route("login", "pages/unauthorized/login.tsx"),
	route("register", "pages/unauthorized/register.tsx"),

	// 認証済みユーザーのレイアウト（メニューバー付き）
	layout("pages/authenticated/_menu.tsx", [
		// コミュニティ関連
		route("community", "pages/authenticated/_menu.home.tsx"),
		route(
			"community/:communityId",
			"pages/authenticated/community/[communityId].tsx",
		),
		route(
			"community/:communityId/member",
			"pages/authenticated/community/[communityId]/member.tsx",
		),
		route(
			"community/:communityId/settings",
			"pages/authenticated/community/[communityId]/settings.tsx",
		),
		route(
			"community/:communityId/addList",
			"pages/authenticated/community/[communityId]/addList.tsx",
		),
		route(
			"community/:communityId/:listId",
			"pages/authenticated/community/[listId].tsx",
		),
		route(
			"community/:communityId/:listId/:itemId",
			"pages/authenticated/community/[itemId].tsx",
		),
		route(
			"community/:communityId/:listId/:itemId/thread",
			"pages/authenticated/community/[itemId]/thread.tsx",
		),
		route(
			"community/:communityId/addItem",
			"pages/authenticated/community/addItem.tsx",
		),

		// ユーザープロフィール
		route("profile", "pages/authenticated/profile/profile.tsx"),
		route("profile/edit", "pages/authenticated/profile/edit.tsx"),
		route("favorites", "pages/authenticated/favorites.tsx"),

		// 通知画面
		route("notifications", "pages/authenticated/notifications.tsx"),
	]),
] satisfies RouteConfig;
