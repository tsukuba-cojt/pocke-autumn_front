import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList, "Favorites">;
};

export default function FavoritesScreen({ navigation }: Props) {
	// Mock data
	const bookmarkedItems = [
		{ id: "1", title: "ハイキュー", author: "古舘春一" },
		{ id: "2", title: "ハイキュー", author: "古舘春一" },
		{ id: "3", title: "ハイキュー", author: "古舘春一" },
		{ id: "4", title: "ハイキュー", author: "古舘春一" },
		{ id: "5", title: "ハイキュー", author: "古舘春一" },
		{ id: "6", title: "ハイキュー", author: "古舘春一" },
		{ id: "7", title: "ハイキュー", author: "古舘春一" },
		{ id: "8", title: "ハイキュー", author: "古舘春一" },
		{ id: "9", title: "ハイキュー", author: "古舘春一" },
	];

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
				<View style={styles.itemsList}>
					{bookmarkedItems.map((item) => (
						<Pressable
							key={item.id}
							style={styles.itemCard}
							onPress={() => {
								// Navigate to item detail
								// navigation.navigate("ItemDetail", { id: item.id });
							}}
						>
							<View style={styles.itemThumbnail} />
							<View style={styles.itemInfo}>
								<Text style={styles.itemTitle}>{item.title}</Text>
								<Text style={styles.itemAuthor}>{item.author}</Text>
							</View>
							<Ionicons name="arrow-forward" size={24} color="#999" />
						</Pressable>
					))}
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
	content: {
		flex: 1,
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
