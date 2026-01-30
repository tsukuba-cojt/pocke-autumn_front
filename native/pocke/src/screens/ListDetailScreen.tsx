import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "ListDetail">;
	route: RouteProp<HomeStackParamList, "ListDetail">;
};

interface ListInformation {
	id: string;
	name: string;
	description: string;
	iconUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

interface ItemData {
	id: string;
	name: string;
	description?: string;
	iconUrl?: string;
	createdAt?: string;
	updatedAt?: string;
	listId?: string;
}

export default function ListDetailScreen({ navigation, route }: Props) {
	const { id } = route.params;
	const [list, setList] = useState<ListInformation | null>(null);
	const [items, setItems] = useState<ItemData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const lastTapRef = useRef<{ [key: string]: number }>({});

	useEffect(() => {
		fetchListData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchListData = async () => {
		setIsLoading(true);
		const token = await getToken();

		try {
			// リスト情報とアイテム一覧を取得
			const itemsResponse = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/item/list/${id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (itemsResponse.ok) {
				const data = await itemsResponse.json();
				console.log("List Detail API response:", data);
				
				// リスト情報をセット
				if (data?.list) {
					setList(data.list);
				}
				
				// アイテム一覧をセット
				if (Array.isArray(data?.items)) {
					setItems(data.items);
				} else if (Array.isArray(data)) {
					setItems(data);
				} else {
					console.warn("Items data is not an array:", data);
					setItems([]);
				}
			} else {
				console.error("アイテム一覧の取得に失敗:", itemsResponse.status);
				setItems([]);
			}
		} catch (error) {
			console.error("データ取得エラー:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMeToo = async (itemId: string) => {
		const token = await getToken();

		try {
			const response = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/item/${itemId}/me-too`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				console.log("Me too 成功:", itemId);
				Alert.alert("成功", "Me too しました！");
			} else {
				console.error("Me too 失敗:", response.status);
				Alert.alert("エラー", "Me too に失敗しました");
			}
		} catch (error) {
			console.error("Me too エラー:", error);
			Alert.alert("エラー", "Me too に失敗しました");
		}
	};

	const handleItemPress = (itemId: string) => {
		const now = Date.now();
		const DOUBLE_TAP_DELAY = 300; // 300ms以内のタップをダブルタップと認識

		if (lastTapRef.current[itemId] && now - lastTapRef.current[itemId] < DOUBLE_TAP_DELAY) {
			// ダブルタップ検出
			delete lastTapRef.current[itemId];
			handleMeToo(itemId);
		} else {
			// シングルタップ
			lastTapRef.current[itemId] = now;
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
				<Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#343D45" />
				</Pressable>
				<Text style={styles.headerTitle}>{list?.name || "リスト詳細"}</Text>
				<View style={styles.spacer} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* List Header Section */}
				<View style={styles.listHeader}>
					<Text style={styles.listHeaderTitle}>{list?.name || "リスト"}</Text>
					{list?.iconUrl ? (
						<Image
							source={{ uri: list.iconUrl }}
							style={styles.listImagePlaceholder}
							resizeMode="cover"
						/>
					) : (
						<View style={styles.listImagePlaceholder} />
					)}
					<Text style={styles.listDescription}>
						{list?.description || "このリストについての説明。"}
					</Text>
				</View>

				{/* Items List */}
				<View style={styles.itemsList}>
					{items.length === 0 ? (
						<Text style={styles.emptyText}>まだアイテムがありません</Text>
					) : (
						items.map((item) => (
							<Pressable 
								key={item.id} 
								style={styles.itemCard}
								onPress={() => handleItemPress(item.id)}
							>
								<View style={styles.itemThumbnail}>
									{item.iconUrl ? (
										<Image
											source={{ uri: item.iconUrl }}
											style={styles.itemThumbnailImage}
											resizeMode="cover"
										/>
									) : (
										<View style={styles.itemThumbnailPlaceholder} />
									)}
								</View>
								<View style={styles.itemInfo}>
									<Text style={styles.itemTitle}>{item.name}</Text>
									<Text style={styles.itemAuthor}>{item.author}</Text>
								</View>
								<View style={styles.memberAvatars}>
									{[1, 2, 3].map((i) => (
									<View key={`${item.id}-avatar-${i}`} style={styles.memberAvatar} />
									))}
								</View>
							</Pressable>
						))
					)}
				</View>
			</ScrollView>

			{/* Floating Action Button */}
			<Pressable 
				style={styles.fab}
				onPress={() => navigation.navigate("AddItem", { listId: id })}
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
		textAlign: "center",
	},
	spacer: {
		width: 48,
	},
	content: {
		flex: 1,
	},
	listHeader: {
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 20,
		marginBottom: 16,
	},
	listHeaderTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#343D45",
		textAlign: "center",
		marginBottom: 16,
	},
	listImagePlaceholder: {
		width: "100%",
		height: 180,
		backgroundColor: "#D9D9D9",
		borderRadius: 8,
		marginBottom: 16,
	},
	listDescription: {
		fontSize: 13,
		color: "#666",
		lineHeight: 18,
	},
	itemsList: {
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
	itemCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		gap: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	itemThumbnail: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#D0D0D0",
		overflow: "hidden",
	},
	itemThumbnailImage: {
		width: "100%",
		height: "100%",
	},
	itemThumbnailPlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#D0D0D0",
	},
	itemInfo: {
		flex: 1,
		gap: 4,
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#343D45",
	},
	itemAuthor: {
		fontSize: 14,
		color: "#999",
	},
	memberAvatars: {
		flexDirection: "row",
		marginLeft: -8,
	},
	memberAvatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#9E9E9E",
		marginLeft: -8,
		borderWidth: 2,
		borderColor: "#FFFFFF",
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
