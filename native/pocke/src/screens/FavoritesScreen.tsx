import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";
import { useState, useEffect } from "react";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList, "Favorites">;
};

interface BookmarkedItem {
	id: string;
	title: string;
	author?: string;
	imageUrl?: string;
	listId?: string;
	communityId?: string;
}

export default function FavoritesScreen({ navigation }: Props) {
	const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchBookmarkedItems();
	}, []);

	const fetchBookmarkedItems = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				console.error("No token found");
				return;
			}

			// TODO: Replace with actual API endpoint when available
			// const response = await fetch(
			// 	"https://pocke-autumn-back.pocke-cojt.workers.dev/me/bookmarks",
			// 	{
			// 		method: "GET",
			// 		headers: {
			// 			Authorization: `Bearer ${token}`,
			// 		},
			// 	}
			// );

			// if (response.ok) {
			// 	const data = await response.json();
			// 	console.log("Bookmarked items:", data);
			// 	setBookmarkedItems(data.items || data || []);
			// } else {
			// 	console.error("Failed to fetch bookmarked items:", response.status);
			// }
			
			// Temporary: empty array until API endpoint is confirmed
			setBookmarkedItems([]);
		} catch (error) {
			console.error("Error fetching bookmarked items:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable 
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="chevron-back" size={28} color="#343D45" />
				</Pressable>
				<View style={styles.headerTitle}>
					<Ionicons name="star-outline" size={24} color="#F2ABAF" />
					<Text style={styles.headerText}>ブックマーク</Text>
				</View>
				<View style={styles.headerSpacer} />
			</View>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#F2ABAF" />
				</View>
			) : (
				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Info Text with Menu */}
				<View style={styles.infoContainer}>
					<Text style={styles.infoText}>
						アイテムをタップするとブックマークしたコミュニティのアイテム詳細ページに移動します
					</Text>
					<Pressable style={styles.menuButton}>
						<Ionicons name="ellipsis-horizontal" size={24} color="#666" />
					</Pressable>
				</View>

				{/* Items List */}
				{bookmarkedItems.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Ionicons name="star-outline" size={48} color="#ccc" />
						<Text style={styles.emptyText}>ブックマークしたアイテムはまだありません</Text>
					</View>
				) : (
					<View style={styles.itemsList}>
						{bookmarkedItems.map((item) => (
							<Pressable
								key={item.id}
								style={styles.itemCard}
								onPress={() => {
									// Navigate to item detail when we have the route
									// navigation.navigate("ItemDetail", { id: item.id });
								}}
							>
								<View style={styles.itemThumbnail} />
								<View style={styles.itemInfo}>
									<Text style={styles.itemTitle}>{item.title}</Text>
									{item.author && (
										<Text style={styles.itemAuthor}>{item.author}</Text>
									)}
								</View>
								<Ionicons name="arrow-forward" size={24} color="#999" />
							</Pressable>
						))}
					</View>
				)}
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingTop: 50,
		paddingBottom: 16,
		backgroundColor: "#fff",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	backButton: {
		padding: 4,
		width: 36,
	},
	headerTitle: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	headerText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#343D45",
	},
	headerSpacer: {
		width: 36,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	emptyText: {
		marginTop: 16,
		fontSize: 14,
		color: "#999",
	},
	infoContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		color: "#666",
		lineHeight: 20,
	},
	menuButton: {
		padding: 4,
		marginLeft: 8,
	},
	itemsList: {
		paddingHorizontal: 16,
		gap: 12,
	},
	itemCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	itemThumbnail: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: "#D9D9D9",
		marginRight: 16,
	},
	itemInfo: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#343D45",
		marginBottom: 4,
	},
	itemAuthor: {
		fontSize: 13,
		color: "#999",
	},
});
