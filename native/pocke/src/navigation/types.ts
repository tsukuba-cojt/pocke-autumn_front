import type { NavigatorScreenParams } from '@react-navigation/native';

export type ProfileStackParamList = {
	ProfileHome: undefined;
	SettingProfile: undefined;
	EditProfile: undefined;
	Favorites: undefined;
	ChangeEmail: undefined;
	ChangePassword: undefined;
};

export type AuthStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	Home: undefined;
	Profile: NavigatorScreenParams<ProfileStackParamList>;
	Notifications: undefined;
};

export type HomeStackParamList = {
	HomeMain: undefined;
	JoinCommunity: { communityId?: string };
	CreateCommunity: undefined;
	CommunityCreated: { communityId: string; communityName: string; inviteCode?: string };
	CommunityDetail: { id: string };
	CommunitySettings: { id: string };
	CommunityMembers: { id: string };
	ListDetail: { id: string };
	CreateList: { communityId: string };
	AddItem: { listId: string };
	UserProfile: { userId: string };
};

export type MainTabParamList = {
	Home: undefined;
	Notifications: undefined;
	Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type CommunityStackParamList = {
	CommunityList: undefined;
	CommunityDetail: { id: string };
	CommunitySettings: { id: string };
	CommunityMembers: { id: string };
	CreateCommunity: undefined;
};

export type ListStackParamList = {
	ListDetail: { id: string };
	CreateList: { communityId: string };
	AddItem: { listId: string };
};

export type RootStackParamList = {
	Auth: undefined;
	MainApp: undefined;
};