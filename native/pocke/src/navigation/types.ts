export type AuthStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	Home: undefined;
	SettingProfile: undefined;
	CreateCommunity: undefined;
};

export type MainTabParamList = {
	Home: undefined;
	CreateCommunity: undefined;
	Notifications: undefined;
	Profile: undefined;
};

export type ProfileStackParamList = {
	ProfileHome: undefined;
	SettingProfile: undefined;
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