import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image, Share, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "CommunityDetail">;
	route: RouteProp<HomeStackParamList, "CommunityDetail">;
};

interface communityInformation {
	id: string;
	name: string;
	description: string;
	iconUrl?: string;
	thumbnailUrl?: string;
	genreName?: string;
	userId?: string;
	createdAt?: string;
	updatedAt?: string;
	communityId?: string;
}

interface ListItem {
	id: string;
	name: string;
	description?: string;
	iconUrl?: string;
	createdAt?: string;
	updatedAt?: string;
	unreadCount?: number;
}

interface MemberItem {
	id: string;
	userId: string;
	communityId: string;
	authority: string;
	createdAt?: string;
	updatedAt?: string;
	user?: {
		id: string;
		name?: string;
		iconUrl?: string;
	};
}

export default function CommunityDetailScreen({ navigation, route }: Props) {
	const { id } = route.params;
	const [community, setCommunity] = useState<communityInformation | null>(null);
	const [lists, setLists] = useState<ListItem[]>([]);
	const [members, setMembers] = useState<MemberItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchCommunityData();
	}, [id]);

	const fetchCommunityData = async () => {
		setIsLoading(true);
		const token = await getToken();

		try {
			// コミュニティ情報を取得
			const communityResponse = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (communityResponse.ok) {
				const communityData = await communityResponse.json();
				console.log("Community API response:", communityData);

			// レスポンスが直接コミュニティオブジェクトかチェック
			if (communityData?.id) {
				setCommunity(communityData);
			} else if (communityData?.community) {
				// レスポンスがオブジェクトで、その中にcommunityがある場合
				setCommunity(communityData.community);
			} else {
				console.error("Unexpected community data structure:", communityData);
			}
		} else {
			console.error("コミュニティ情報の取得に失敗:", communityResponse.status);
			const errorText = await communityResponse.text();
			console.error("Error response:", errorText);
		}

		// リスト一覧を取得
		const listsResponse = await fetch(
			`https://pocke-autumn-back.pocke-cojt.workers.dev/list/community/${id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (listsResponse.ok) {
			const listsData = await listsResponse.json();
			console.log("Lists API response:", listsData);
			// レスポンスが配列かどうかチェック
			if (Array.isArray(listsData)) {
				setLists(listsData);
			} else if (listsData && Array.isArray(listsData.lists)) {
				// レスポンスがオブジェクトで、その中にlists配列がある場合
				setLists(listsData.lists);
			} else {
				// 配列でない場合は空配列をセット
				console.warn("Lists data is not an array:", listsData);
				setLists([]);
			}
		} else {
			console.error("リスト一覧の取得に失敗:", listsResponse.status);
			setLists([]);
		}

		// メンバー一覧を取得
		const membersResponse = await fetch(
			`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}/members`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (membersResponse.ok) {
				const membersData = await membersResponse.json();
				console.log("Members API response:", membersData);
				// レスポンスが配列かどうかチェック
				if (Array.isArray(membersData)) {
					setMembers(membersData);
				} else if (membersData && Array.isArray(membersData.members)) {
					setMembers(membersData.members);
				} else {
					console.warn("Members data is not an array:", membersData);
					setMembers([]);
				}
			} else {
				console.error("メンバー一覧の取得に失敗:", membersResponse.status);
				setMembers([]);
			}
		} catch (error) {
			console.error("データ取得エラー:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInvite = async () => {
		const token = await getToken();

		try {
			const response = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}/invite`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log("Invite link response:", data);
				
				// APIから返ってくるdeeplinkを取得
				const inviteLink = data.inviteLink || data.link || data.url;
				
				if (inviteLink) {
					// シェア機能を使用して招待リンクを共有
					try {
						const result = await Share.share({
							message: `${community?.name}に招待します！\n\n${inviteLink}`,
							url: inviteLink,
						});

						if (result.action === Share.sharedAction) {
							if (result.activityType) {
								console.log("共有されました:", result.activityType);
							} else {
								console.log("共有されました");
							}
						} else if (result.action === Share.dismissedAction) {
							console.log("共有がキャンセルされました");
						}
					} catch (shareError) {
						console.error("共有エラー:", shareError);
						Alert.alert("エラー", "招待リンクの共有に失敗しました");
					}
				} else {
					console.error("招待リンクがレスポンスに含まれていません:", data);
					Alert.alert("エラー", "招待リンクの取得に失敗しました");
				}
			} else {
				console.error("招待リンクの取得に失敗:", response.status);
				const errorText = await response.text();
				console.error("Error response:", errorText);
				Alert.alert("エラー", "招待リンクの取得に失敗しました");
			}
		} catch (error) {
			console.error("招待リンク取得エラー:", error);
			Alert.alert("エラー", "招待リンクの取得中にエラーが発生しました");
		}
	};

	if (isLoading) {
		return (
			<View style={[styles.container, styles.loadingContainer]}>
				<ActivityIndicator size="large" color="#F2ABAF" />
			</View>
		);
	}

	if (!community) {
		return (
			<View style={[styles.container, styles.loadingContainer]}>
				<Text style={styles.errorText}>コミュニティ情報の取得に失敗しました</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#343D45" />
				</Pressable>
				<Text style={styles.headerTitle}>コミュニティ内</Text>
				<View style={styles.headerActions}>
				<Pressable 
					style={styles.headerIconButton}
					onPress={handleInvite}
				>
						<Ionicons name="person-add-outline" size={24} color="#343D45" />
					</Pressable>
					<Pressable 
						style={styles.headerIconButton}
						onPress={() => navigation.navigate("CommunitySettings", { id })}
					>
						<Ionicons name="settings-outline" size={24} color="#343D45" />
					</Pressable>
				</View>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Community Icon Banner */}
				{(community.iconUrl || community.thumbnailUrl) ? (
					<Image
						source={{ uri: community.iconUrl || community.thumbnailUrl }}
						style={styles.communityBanner}
						resizeMode="cover"
					onLoad={() => console.log("Community banner loaded:", community.iconUrl || community.thumbnailUrl)}
					onError={(error) => console.error("Community banner load error:", error.nativeEvent.error, "URL:", community.iconUrl || community.thumbnailUrl)}
				/>
			) : (
				<View style={styles.communityBannerPlaceholder}>
					<Text style={{ color: '#999', textAlign: 'center' }}>画像がありません</Text>
				</View>
			)}

			{/* Community Info Section */}
			<View style={styles.communityInfo}>
				<Text style={styles.communityName}>{community.name}</Text>
				<Text style={styles.communityDescription}>{community.description}</Text>

				{/* Members Section */}
				<View style={styles.membersSection}>
					<View style={styles.memberAvatars}>
						{members.slice(0, 4).map((member, index) => (
							<View key={member.id || `member-${index}`} style={styles.memberAvatar}>
								{member.user?.iconUrl ? (
									<Image
										source={{ uri: member.user.iconUrl }}
										style={styles.memberAvatarImage}
										resizeMode="cover"
									/>
								) : (
									<View style={styles.memberAvatarPlaceholder} />
								)}
							</View>
						))}
					</View>
					<Pressable 
						style={styles.memberCount}
						onPress={() => navigation.navigate("CommunityMembers", { id })}
					>
						<Text style={styles.memberCountText}>{members.length}</Text>
						<Ionicons name="chevron-forward" size={16} color="#343D45" />
					</Pressable>
				</View>
			</View>

			{/* Lists Section */}
			<View style={styles.listsSection}>
					{lists.length === 0 ? (
						<Text style={styles.emptyText}>まだリストがありません</Text>
					) : (
						lists.map((list) => (
							<Pressable 
								key={list.id} 
								style={styles.listCard}
								onPress={() => navigation.navigate("ListDetail", { id: list.id })}
							>
								<View style={styles.listThumbnail}>
									{list.iconUrl ? (
										<Image
											source={{ uri: list.iconUrl }}
											style={styles.listThumbnailImage}
											resizeMode="cover"
										/>
									) : (
										<View style={styles.listThumbnailPlaceholder} />
									)}
									{list.unreadCount && list.unreadCount > 0 && (
										<View style={styles.unreadBadge} />
									)}
								</View>
								<Text style={styles.listTitle}>{list.name}</Text>
							</Pressable>
						))
					)}
				</View>
			</ScrollView>

			{/* Floating Action Button */}
			<Pressable 
				style={styles.fab}
				onPress={() => navigation.navigate("CreateList", { communityId: id })}
			>
				<Ionicons name="add" size={32} color="#343D45" />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	loadingContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 60,
		paddingHorizontal: 16,
		paddingBottom: 16,
		backgroundColor: "#EFF2F6",
	},
	backButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		flex: 1,
		fontSize: 16,
		fontWeight: "600",
		color: "#343D45",
		marginLeft: 16,
	},
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#FFFFFF",
		borderRadius: 24,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	headerIconButton: {
		width: 32,
		height: 32,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
	},
	communityBanner: {
		width: "100%",
		height: 200,
		backgroundColor: "#D9D9D9",
	},
	communityBannerPlaceholder: {
		width: "100%",
		height: 200,
		backgroundColor: "#D9D9D9",
	},
	communityInfo: {
		paddingHorizontal: 24,
		paddingVertical: 24,
		backgroundColor: "#FFFFFF",
		marginBottom: 16,
	},
	communityIcon: {
		width: 100,
		height: 100,
		borderRadius: 12,
		marginBottom: 16,
	},
	communityName: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#343D45",
		marginBottom: 12,
	},
	communityDescription: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		marginBottom: 20,
	},
	membersSection: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	memberAvatars: {
		flexDirection: "row",
		marginLeft: -8,
	},
	memberAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#9E9E9E",
		marginLeft: 0,
		borderWidth: 2,
		borderColor: "#FFFFFF",
		overflow: "hidden",
	},
	memberAvatarImage: {
		width: "100%",
		height: "100%",
	},
	memberAvatarPlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#9E9E9E",
	},
	memberCount: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	memberCountText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#343D45",
	},
	listsSection: {
		paddingHorizontal: 24,
		gap: 12,
		paddingBottom: 100,
	},
	emptyText: {
		fontSize: 14,
		color: "#999",
		textAlign: "center",
		paddingVertical: 40,
	},
	listCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		gap: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	listThumbnail: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#3C4449",
		position: "relative",
		overflow: "hidden",
	},
	listThumbnailImage: {
		width: "100%",
		height: "100%",
	},
	listThumbnailPlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#3C4449",
	},
	unreadBadge: {
		position: "absolute",
		top: -6,
		left: -6,
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: "#F2ABAF",
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	listTitle: {
		flex: 1,
		fontSize: 16,
		fontWeight: "500",
		color: "#343D45",
	},
	fab: {
		position: "absolute",
		bottom: 32,
		right: 24,
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 8,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
});
