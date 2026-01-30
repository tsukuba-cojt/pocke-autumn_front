import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader, { screenHeaderStyles } from "../components/ScreenHeader";
import { useState, useEffect } from "react";
import { getToken } from "../utils/tokenManager";

interface Notification {
	id: string;
	type: string;
	message: string;
	time: string;
	read: boolean;
}

export default function NotificationsScreen() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				console.error("No token found");
				return;
			}

			// TODO: Replace with actual API endpoint when available
			// const response = await fetch(
			// 	"https://pocke-autumn-back.pocke-cojt.workers.dev/me/notifications",
			// 	{
			// 		method: "GET",
			// 		headers: {
			// 			Authorization: `Bearer ${token}`,
			// 		},
			// 	}
			// );

			// if (response.ok) {
			// 	const data = await response.json();
			// 	console.log("Notifications:", data);
			// 	setNotifications(data.notifications || data || []);
			// } else {
			// 	console.error("Failed to fetch notifications:", response.status);
			// }

			// Temporary: empty array until API endpoint is confirmed
			setNotifications([]);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		} finally {
			setIsLoading(false);
		}
	};

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

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#F2ABAF" />
				</View>
			) : notifications.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Ionicons name="notifications-outline" size={48} color="#ccc" />
					<Text style={styles.emptyText}>通知はありません</Text>
				</View>
			) : (
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
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	header: screenHeaderStyles.header,
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
	},
	emptyText: {
		marginTop: 16,
		fontSize: 14,
		color: "#999",
	},
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