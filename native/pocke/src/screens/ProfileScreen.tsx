import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { ProfileStackParamList, MainTabParamList, RootStackParamList } from "../navigation/types";
import Logo from "../components/Logo";
import ToggleSwitch from "../components/ToggleSwitch";
import Svg, { Path } from "react-native-svg";
import { getToken, clearToken } from "../utils/tokenManager";

type ProfileScreenNavigationProp = CompositeNavigationProp<
	NativeStackNavigationProp<ProfileStackParamList>,
	NativeStackNavigationProp<RootStackParamList>
>;
type TabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

interface UserData {
	id: string;
	username: string;
	displayName: string;
	iconUrl?: string;
	twitterUrl?: string;
	instagramUrl?: string;
	githubUrl?: string;
	email?: string;
	createdAt?: string;
	updatedAt?: string;
}

export default function ProfileScreen() {
	const navigation = useNavigation<ProfileScreenNavigationProp>();
	const tabNavigation = useNavigation<TabNavigationProp>();
	// トグルを常に右側（ユーザーアイコン側）にするためtrueに設定
	const [toggleValue, setToggleValue] = useState(true);

	useEffect(() => {
		console.log("ProfileScreen toggleValue:", toggleValue);
	}, [toggleValue]);
	const [user, setUser] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useFocusEffect(
		useCallback(() => {
			// 画面にフォーカスが当たるたびにトグルを右側（true）にリセット
			setToggleValue(true);
			fetchUserProfile();
		}, [])
	);

	const fetchUserProfile = async () => {
		setIsLoading(true);
		const token = await getToken();

		if (!token) {
			console.log("No token found, redirecting to login");
			handleLogout();
			return;
		}

		try {
			const response = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/me",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log("User profile:", data);
				setUser(data.user);
			} else if (response.status === 401) {
				console.error("Token is invalid or expired (401), logging out");
				handleLogout();
			} else {
				console.error("Failed to fetch user profile:", response.status);
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			// トークンを削除
			await clearToken();
			console.log("ログアウトしました");
			
			// ルートナビゲーターにアクセスしてWelcome画面にリセット（スタック全削除）
			let rootNavigation = navigation.getParent();
			
			// 複数のレベルを遡ってルートナビゲーターを見つける
			while (rootNavigation?.getParent()) {
				rootNavigation = rootNavigation.getParent();
			}
			
			if (rootNavigation) {
				rootNavigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: 'Welcome' }],
					})
				);
			}
		} catch (error) {
			console.error("ログアウトエラー:", error);
		}
	};

	if (isLoading) {
		return (
			<View style={[styles.container, styles.loadingContainer]}>
				<ActivityIndicator size="large" color="#F2ABAF" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Logo width={120} height={42} />
				<Pressable style={styles.notificationButton}>
					<Ionicons name="notifications-outline" size={28} color="#343D45" />
					<View style={styles.badge} />
				</Pressable>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Profile Card */}
				<View style={styles.profileCard}>
					{user?.iconUrl ? (
						<Image
							source={{ uri: user.iconUrl }}
							style={styles.avatar}
							resizeMode="cover"
						/>
					) : (
						<View style={styles.avatar} />
					)}
					<Text style={styles.username}>{user?.username || "読み込み中..."}</Text>
					<Text style={styles.displayName}>@{user?.displayName || "..."}</Text>

					{/* Social Icons */}
					<View style={styles.socialIcons}>
						<Pressable style={styles.socialIcon}>
							<Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#343D45"/>
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

				{/* Bookmark Section */}
				<Pressable style={styles.menuItem} onPress={() => navigation.navigate("Favorites")}>
					<View style={styles.menuItemLeft}>
						<Ionicons name="bookmark-outline" size={24} color="#F2ABAF" />
						<Text style={styles.menuItemText}>ブックマーク</Text>
					</View>
					<Ionicons name="chevron-forward" size={24} color="#999" />
				</Pressable>

				{/* Settings Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>設定</Text>
					<Text style={styles.sectionSubtitle}>アカウント情報</Text>

					<View style={styles.settingsMenu}>
						<Pressable style={styles.settingsItem} onPress={() => navigation.navigate("EditProfile")}>
							<View style={styles.settingsItemLeft}>
								<Ionicons name="person-outline" size={24} color="#343D45" />
								<Text style={styles.settingsItemText}>プロフィールの編集</Text>
							</View>
							<Ionicons name="chevron-forward" size={24} color="#999" />
						</Pressable>

						<Pressable style={styles.settingsItem} onPress={() => navigation.navigate("ChangeEmail")}>
							<View style={styles.settingsItemLeft}>
								<Ionicons name="mail-outline" size={24} color="#343D45" />
								<Text style={styles.settingsItemText}>メールアドレス変更</Text>
							</View>
							<Ionicons name="chevron-forward" size={24} color="#999" />
						</Pressable>

						<Pressable style={styles.settingsItem} onPress={() => navigation.navigate("ChangePassword")}>
							<View style={styles.settingsItemLeft}>
								<Ionicons name="lock-closed-outline" size={24} color="#343D45" />
								<Text style={styles.settingsItemText}>パスワード変更</Text>
							</View>
							<Ionicons name="chevron-forward" size={24} color="#999" />
						</Pressable>
					</View>

					<Pressable style={styles.logoutButton} onPress={handleLogout}>
						<Text style={styles.logoutText}>ログアウト</Text>
					</Pressable>
				</View>
			</ScrollView>

			{/* Floating Toggle */}
			<View style={styles.floatingToggle}>
				<ToggleSwitch
					value={toggleValue}
					onValueChange={(newValue) => {
						setToggleValue(newValue);
						if (!newValue) {
							tabNavigation.navigate("Home");
						}
					}}
				/>
			</View>
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 24,
		paddingTop: 50,
		paddingBottom: 16,
		backgroundColor: "#fff",
	},
	notificationButton: {
		position: "relative",
	},
	badge: {
		position: "absolute",
		top: 2,
		right: 2,
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#F2ABAF",
		borderWidth: 2,
		borderColor: "#fff",
	},
	content: {
		flex: 1,
	},
	profileCard: {
		backgroundColor: "#fff",
		marginHorizontal: 24,
		marginTop: 24,
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
		backgroundColor: "#343D45",
		marginBottom: 16,
		overflow: "hidden",
	},
	username: {
		fontSize: 24,
		fontWeight: "700",
		color: "#343D45",
		marginBottom: 4,
	},
	displayName: {
		fontSize: 14,
		color: "#999",
		marginBottom: 20,
	},
	socialIcons: {
		flexDirection: "row",
		gap: 24,
	},
	socialIcon: {
		padding: 4,
	},
	menuItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		marginHorizontal: 24,
		marginTop: 16,
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	menuItemText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#343D45",
	},
	section: {
		marginTop: 32,
		paddingHorizontal: 24,
		paddingBottom: 100,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#343D45",
		marginBottom: 8,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: "#999",
		marginBottom: 16,
	},
	settingsMenu: {
		backgroundColor: "#fff",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
		overflow: "hidden",
	},
	settingsItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#F5F5F5",
	},
	settingsItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	settingsItemText: {
		fontSize: 15,
		color: "#343D45",
	},
	logoutButton: {
		marginTop: 24,
		paddingVertical: 16,
		alignItems: "center",
	},
	logoutText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#F2ABAF",
	},
	floatingToggle: {
		position: "absolute",
		bottom: 24,
		right: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
});