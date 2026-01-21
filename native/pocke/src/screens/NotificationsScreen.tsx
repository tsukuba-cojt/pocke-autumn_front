import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader, { screenHeaderStyles } from "../components/ScreenHeader";

export default function NotificationsScreen() {
	const notifications = [
		{
			id: "1",
			type: "comment",
			message: "新しいコメントがあります",
			time: "2時間前",
			read: false,
		},
		{
			id: "2",
			type: "member",
			message: "新しいメンバーが参加しました",
			time: "5時間前",
			read: true,
		},
	];

	type IoniconName = keyof typeof Ionicons.glyphMap;

	const getIconName = (type: string): IoniconName => {
		switch (type) {
			case "comment":
				return "chatbubble";
			case "member":
				return "person-add";
			default:
				return "notifications";
		}
	};

	return (
		<View style={styles.container}>
			<ScreenHeader title="通知" />

			<ScrollView style={styles.content}>
				{notifications.map((notification) => (
					<Pressable
						key={notification.id}
						style={[
							styles.notificationCard,
							!notification.read && styles.unreadCard,
						]}
					>
						<View
							style={[
								styles.iconContainer,
								!notification.read && styles.unreadIcon,
							]}
						>
							<Ionicons
								name={getIconName(notification.type)}
								size={24}
								color="#fff"
							/>
						</View>
						<View style={styles.notificationContent}>
							<Text
								style={[
									styles.message,
									!notification.read && styles.unreadText,
								]}
							>
								{notification.message}
							</Text>
							<Text style={styles.time}>{notification.time}</Text>
						</View>
					</Pressable>
				))}
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
		paddingHorizontal: 24,
	},
	notificationCard: {
		flexDirection: "row",
		gap: 12,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	unreadCard: {
		backgroundColor: "#fff",
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#ccc",
		justifyContent: "center",
		alignItems: "center",
	},
	unreadIcon: {
		backgroundColor: "#F2ABAF",
	},
	notificationContent: {
		flex: 1,
		gap: 4,
	},
	message: {
		fontSize: 16,
		color: "#343D45",
	},
	unreadText: {
		fontWeight: "600",
	},
	time: {
		fontSize: 14,
		color: "#999",
	},
});