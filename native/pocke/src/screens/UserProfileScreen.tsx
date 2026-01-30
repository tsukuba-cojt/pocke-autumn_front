import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { getToken } from "../utils/tokenManager";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { ProfileStackParamList, HomeStackParamList, MainTabParamList } from "../navigation/types";
import Svg, { Path } from "react-native-svg";

type UserProfileScreenNavigationProp = CompositeNavigationProp<
	NativeStackNavigationProp<ProfileStackParamList>,
	CompositeNavigationProp<
		BottomTabNavigationProp<MainTabParamList>,
		NativeStackNavigationProp<HomeStackParamList>
	>
>;

interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	bio?: string;
}

interface Community {
	id: string;
	name: string;
	description: string;
	iconUrl?: string;
	createdAt: string;
	updatedAt: string;
	authority: string;
	joinedAt: string;
}

type Props = {
	route: {
		params?: {
			userId?: string;
		};
	};
};

export default function UserProfileScreen({ route }: Props) {
	const navigation = useNavigation<UserProfileScreenNavigationProp>();
	const userId = route.params?.userId;

	const [user, setUser] = useState<User | null>(null);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = await getToken();

				if (!token) {
					console.error("Token not found");
					setLoading(false);
					return;
				}

				// ユーザー情報を取得
				if (userId) {
					const userResponse = await fetch(
						`https://pocke-autumn-back.pocke-cojt.workers.dev/user/${userId}`,
						{
							headers: {
								"Authorization": `Bearer ${token}`,
								"Content-Type": "application/json"
							}
						}
					);

					if (userResponse.ok) {
						const userData = await userResponse.json();
						console.log("User data:", userData);
						setUser(userData);
					} else {
						console.error("Failed to fetch user:", userResponse.status);
					}

					// ユーザーのコミュニティを取得
					const communitiesResponse = await fetch(
						`https://pocke-autumn-back.pocke-cojt.workers.dev/community/user/${userId}`,
						{
							headers: {
								"Authorization": `Bearer ${token}`,
								"Content-Type": "application/json"
							}
						}
					);

					if (communitiesResponse.ok) {
						const communitiesData = await communitiesResponse.json();
						console.log("Communities data:", communitiesData);

						if (Array.isArray(communitiesData)) {
							setCommunities(communitiesData);
						} else if (communitiesData && Array.isArray(communitiesData.communities)) {
							setCommunities(communitiesData.communities);
						} else {
							setCommunities([]);
						}
					} else {
						console.error("Failed to fetch communities:", communitiesResponse.status);
					}
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [userId]);

	if (loading) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<ActivityIndicator size="large" color="#F2ABAF" />
			</View>
		);
	}

	if (!user) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<Text style={styles.errorText}>ユーザー情報を取得できませんでした</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header with Back Button */}
			<View style={styles.header}>
				<Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
					<Ionicons name="chevron-back" size={28} color="#343D45" />
				</Pressable>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Profile Card */}
				<View style={styles.profileCard}>
					<View style={styles.avatar} />
					<Text style={styles.name}>{user.name}</Text>
					<Text style={styles.username}>{user.email}</Text>
					{user.bio && <Text style={styles.bio}>{user.bio}</Text>}

					{/* Social Icons */}
					<View style={styles.socialIcons}>
						<Pressable style={styles.socialIcon}>
							<Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<Path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
									fill="#343D45"
								/>
							</Svg>
						</Pressable>
						<Pressable style={styles.socialIcon}>
							<Ionicons name="logo-instagram" size={24} color="#343D45" />
						</Pressable>
						<Pressable style={styles.socialIcon}>
							<Ionicons name="logo-github" size={24} color="#343D45" />
						</Pressable>
					</View>
				</View>

				{/* Communities Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>所属コミュニティ</Text>

					{communities.length > 0 ? (
						<View style={styles.communitiesGrid}>
							{communities.map((community) => (
								<Pressable
									key={community.id}
									style={styles.communityCard}
								onPress={() => {
									// Homeタブに切り替えてからCommunityDetailに遷移
									navigation.navigate('Home', {
										screen: 'CommunityDetail',
										params: { id: community.id }
									});
								}}
								>
									<View style={styles.communityImage} />
									<Text style={styles.communityName}>{community.name}</Text>
								</Pressable>
							))}
						</View>
					) : (
						<Text style={styles.emptyText}>所属しているコミュニティはありません</Text>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	centerContent: {
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
		color: "#999",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 50,
		paddingHorizontal: 16,
		paddingBottom: 16,
		backgroundColor: "#EFF2F6",
	},
	backButton: {
		padding: 4,
	},
	content: {
		flex: 1,
	},
	profileCard: {
		backgroundColor: "#fff",
		marginHorizontal: 24,
		marginTop: 8,
		borderRadius: 16,
		padding: 32,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#F2ABAF",
		marginBottom: 16,
	},
	name: {
		fontSize: 24,
		fontWeight: "700",
		color: "#343D45",
		marginBottom: 4,
	},
	username: {
		fontSize: 14,
		color: "#999",
		marginBottom: 8,
	},
	bio: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
	},
	socialIcons: {
		flexDirection: "row",
		gap: 24,
	},
	socialIcon: {
		padding: 4,
	},
	section: {
		paddingHorizontal: 24,
		paddingTop: 32,
		paddingBottom: 100,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#343D45",
		marginBottom: 16,
	},
	communitiesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
	},
	communityCard: {
		width: "47%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	communityImage: {
		width: "100%",
		height: 100,
		backgroundColor: "#E8EAED",
		borderRadius: 8,
		marginBottom: 12,
	},
	communityName: {
		fontSize: 14,
		color: "#343D45",
		textAlign: "center",
	},
	emptyText: {
		fontSize: 14,
		color: "#999",
		textAlign: "center",
		marginTop: 20,
	},
});
