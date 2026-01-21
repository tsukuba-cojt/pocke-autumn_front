import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";
import Logo from "../components/Logo";
import Svg, { Path } from "react-native-svg";

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList>;
};

export default function ProfileScreen({ navigation }: Props) {
	const user = {
		name: "hui",
		username: "@huimein",
		avatar: null,
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Logo width={120} height={42} />
				<Pressable style={styles.notificationButton}>
					<Ionicons name="notifications-outline" size={28} color="#343D45" />
				</Pressable>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Profile Card */}
				<View style={styles.profileCard}>
					<View style={styles.avatar} />
					<Text style={styles.name}>{user.name}</Text>
					<Text style={styles.username}>{user.username}</Text>
					
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
				<Pressable style={styles.bookmarkSection}>
					<Ionicons name="star-outline" size={24} color="#F2ABAF" />
					<Text style={styles.bookmarkText}>ブックマーク</Text>
					<Ionicons name="chevron-forward" size={24} color="#CCC" />
				</Pressable>

				{/* Settings Section */}
				<View style={styles.settingsSection}>
					<Text style={styles.sectionTitle}>設定</Text>
					
					<Text style={styles.sectionSubtitle}>アカウント情報</Text>
					
					<Pressable 
						style={styles.settingsItem}
						onPress={() => navigation.navigate("SettingProfile")}
					>
						<Ionicons name="person-outline" size={24} color="#343D45" />
						<Text style={styles.settingsText}>プロフィールの編集</Text>
						<Ionicons name="chevron-forward" size={24} color="#CCC" />
					</Pressable>

					<Pressable style={styles.settingsItem}>
						<Ionicons name="mail-outline" size={24} color="#343D45" />
						<Text style={styles.settingsText}>メールアドレス変更</Text>
						<Ionicons name="chevron-forward" size={24} color="#CCC" />
					</Pressable>

					<Pressable style={styles.settingsItem}>
						<Ionicons name="lock-closed-outline" size={24} color="#343D45" />
						<Text style={styles.settingsText}>パスワード変更</Text>
						<Ionicons name="chevron-forward" size={24} color="#CCC" />
					</Pressable>

					{/* Logout */}
					<Pressable style={styles.logoutButton}>
						<Text style={styles.logoutText}>ログアウト</Text>
					</Pressable>
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 24,
		paddingTop: 50,
		paddingBottom: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
	},
	notificationButton: {
		padding: 4,
	},
	content: {
		flex: 1,
	},
	profileCard: {
		backgroundColor: "#fff",
		marginHorizontal: 24,
		marginTop: 24,
		marginBottom: 16,
		borderRadius: 16,
		padding: 32,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#343D45",
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
		marginBottom: 20,
	},
	socialIcons: {
		flexDirection: "row",
		gap: 24,
	},
	socialIcon: {
		padding: 4,
	},
	bookmarkSection: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		marginHorizontal: 24,
		marginBottom: 16,
		paddingVertical: 18,
		paddingHorizontal: 20,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.03,
		shadowRadius: 4,
		elevation: 1,
	},
	bookmarkText: {
		flex: 1,
		fontSize: 16,
		fontWeight: "500",
		color: "#343D45",
		marginLeft: 12,
	},
	settingsSection: {
		backgroundColor: "#fff",
		marginHorizontal: 24,
		marginBottom: 24,
		borderRadius: 12,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.03,
		shadowRadius: 4,
		elevation: 1,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#343D45",
		marginBottom: 16,
	},
	sectionSubtitle: {
		fontSize: 13,
		color: "#999",
		marginBottom: 12,
	},
	settingsItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F5F5F5",
	},
	settingsText: {
		flex: 1,
		fontSize: 15,
		color: "#343D45",
		marginLeft: 12,
	},
	logoutButton: {
		paddingVertical: 16,
		alignItems: "flex-start",
	},
	logoutText: {
		fontSize: 15,
		color: "#F2ABAF",
		fontWeight: "500",
	},
});