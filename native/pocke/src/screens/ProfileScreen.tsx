import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";
import ScreenHeader, { screenHeaderStyles } from "../components/ScreenHeader";

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList>;
};

export default function ProfileScreen({ navigation }: Props) {
	const user = {
		name: "jsys24",
		bio: "よろしくお願いします",
		avatar: null,
	};

	return (
		<View style={styles.container}>
			<ScreenHeader
				title="プロフィール"
				rightIcon="settings-outline"
				onRightPress={() => navigation.navigate("SettingProfile")}
			/>

			<ScrollView style={styles.content}>
				<View style={styles.profileSection}>
					<View style={styles.avatar} />
					<Text style={styles.name}>{user.name}</Text>
					<Text style={styles.bio}>{user.bio}</Text>
				</View>

				<View style={styles.menuSection}>
					<Pressable style={styles.menuItem}>
						<Ionicons name="bookmark-outline" size={24} color="#333" />
						<Text style={styles.menuText}>お気に入り</Text>
						<Ionicons name="chevron-forward" size={24} color="#ccc" />
					</Pressable>

					<Pressable style={styles.menuItem}>
						<Ionicons name="help-circle-outline" size={24} color="#333" />
						<Text style={styles.menuText}>ヘルプ</Text>
						<Ionicons name="chevron-forward" size={24} color="#ccc" />
					</Pressable>

					<Pressable style={styles.menuItem}>
						<Ionicons name="log-out-outline" size={24} color="#FF6B9D" />
						<Text style={[styles.menuText, styles.logoutText]}>ログアウト</Text>
						<Ionicons name="chevron-forward" size={24} color="#ccc" />
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
	header: screenHeaderStyles.header,
	content: {
		flex: 1,
	},
	profileSection: {
		alignItems: "center",
		paddingVertical: 32,
		gap: 12,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#fff",
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#343D45",
	},
	bio: {
		fontSize: 16,
		color: "#343D45",
		textAlign: "center",
		paddingHorizontal: 24,
	},
	menuSection: {
		paddingHorizontal: 24,
		gap: 0,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	menuText: {
		flex: 1,
		fontSize: 16,
		color: "#343D45",
	},
	logoutText: {
		color: "#F2ABAF",
	},
});