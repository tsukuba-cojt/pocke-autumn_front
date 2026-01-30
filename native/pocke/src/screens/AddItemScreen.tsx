import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import { getToken, clearToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "AddItem">;
	route: RouteProp<HomeStackParamList, "AddItem">;
};

export default function AddItemScreen({ navigation, route }: Props) {
	const { listId } = route.params;
	const [activeTab, setActiveTab] = useState<"search" | "manual">("search");
	const [genre, setGenre] = useState("書籍");
	const [showGenreModal, setShowGenreModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [itemName, setItemName] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [url, setUrl] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const genres = ["書籍", "雑誌", "映画", "マンガ", "アニメ", "音楽", "場所", "料理", "観光地", "サービス", "アプリ"];

	// Mock search results
	const searchResults = [
		{ id: "1", title: "First Love", subtitle: "宇多田ヒカル" },
		{ id: "2", title: "First Love", subtitle: "宇多田ヒカル" },
		{ id: "3", title: "First Love", subtitle: "宇多田ヒカル" },
		{ id: "4", title: "First Love", subtitle: "宇多田ヒカル" },
		{ id: "5", title: "First Love", subtitle: "宇多田ヒカル" },
		{ id: "6", title: "First Love", subtitle: "宇多田ヒカル" },
	];

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [16, 9],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const handleCreate = async () => {
		if (!itemName.trim()) {
			Alert.alert("エラー", "アイテム名を入力してください");
			return;
		}

		setIsLoading(true);
		const token = await getToken();

		if (!token) {
			Alert.alert("エラー", "ログインしてください");
			setIsLoading(false);
			return;
		}

		try {
			// ユーザー情報を取得してuserIdを取得
			const userResponse = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/me",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (userResponse.status === 401) {
				Alert.alert("セッション切れ", "再度ログインしてください");
				await clearToken();
				let rootNavigation = navigation.getParent();
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
				setIsLoading(false);
				return;
			}

			if (!userResponse.ok) {
				Alert.alert("エラー", "ユーザー情報の取得に失敗しました");
				setIsLoading(false);
				return;
			}

			const userData = await userResponse.json();
			const userId = userData.id;
			const listId = route.params.listId;
			console.log("Creating item with userId:", userId, "and listId:", listId);

			// アイテムを作成
			const response = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/item/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						title: itemName.trim(),
						listId: listId,
						userId: userId,
						url: url.trim() || null,
						author: authorName.trim() || null,
						imageUrl: image || null,
						genreId: null,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log("アイテム作成成功:", data);
				navigation.goBack();
			} else if (response.status === 401) {
				Alert.alert("セッション切れ", "再度ログインしてください");
				await clearToken();
				let rootNavigation = navigation.getParent();
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
			} else {
				const errorText = await response.text();
				console.error("アイテム作成失敗:", response.status, errorText);
				Alert.alert("エラー", `アイテムの作成に失敗しました\n\nステータス: ${response.status}`);
			}
		} catch (error) {
			console.error("アイテム作成エラー:", error);
			Alert.alert("エラー", `アイテムの作成に失敗しました\n\n${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
					<Ionicons name="close" size={28} color="#5A5A5A" />
				</Pressable>
				<Text style={styles.headerTitle}>アイテムの追加</Text>
			</View>

			{/* Tabs */}
			<View style={styles.tabContainer}>
				<Pressable
					style={[styles.tab, activeTab === "search" && styles.activeTab]}
					onPress={() => setActiveTab("search")}
				>
					<Text style={[styles.tabText, activeTab === "search" && styles.activeTabText]}>
						検索
					</Text>
				</Pressable>
				<Pressable
					style={[styles.tab, activeTab === "manual" && styles.activeTab]}
					onPress={() => setActiveTab("manual")}
				>
					<Text style={[styles.tabText, activeTab === "manual" && styles.activeTabText]}>
						手動
					</Text>
				</Pressable>
			</View>

			<ScrollView style={styles.content}>
				{activeTab === "search" ? (
					// Search Tab
					<View style={styles.searchTab}>
						{/* Genre Selector */}
						<Pressable style={styles.genreSelector} onPress={() => setShowGenreModal(true)}>
							<Ionicons name="book-outline" size={20} color="#666" />
							<Text style={styles.genreText}>{genre}</Text>
							<Ionicons name="chevron-down" size={20} color="#666" />
						</Pressable>

						{/* Search Bar */}
						<View style={styles.searchBar}>
							<Ionicons name="search" size={20} color="#999" />
							<TextInput
								style={styles.searchInput}
								placeholder="アイテムを検索"
								value={searchQuery}
								onChangeText={setSearchQuery}
								placeholderTextColor="#999"
							/>
						</View>

						{/* Search Results */}
						<View style={styles.resultsList}>
							{searchResults.map((item) => (
								<View key={`${item.id}-${item.title}`} style={styles.resultItem}>
									<View style={styles.resultImage} />
									<View style={styles.resultInfo}>
										<Text style={styles.resultTitle}>{item.title}</Text>
										<Text style={styles.resultSubtitle}>{item.subtitle}</Text>
									</View>
									<Pressable style={styles.addButton}>
										<Ionicons name="add-circle-outline" size={28} color="#F2ABAF" />
									</Pressable>
								</View>
							))}
						</View>
					</View>
				) : (
					// Manual Tab
					<View style={styles.manualTab}>
						{/* Genre */}
						<View style={styles.formGroup}>
							<Text style={styles.label}>
								ジャンル <Text style={styles.required}>*</Text>
							</Text>
							<Pressable style={styles.dropdown} onPress={() => setShowGenreModal(true)}>
								<Ionicons name="book-outline" size={20} color="#666" />
								<Text style={styles.dropdownText}>{genre}</Text>
								<Ionicons name="chevron-down" size={20} color="#666" />
							</Pressable>
						</View>

						{/* Name */}
						<View style={styles.formGroup}>
							<View style={styles.labelRow}>
								<Text style={styles.label}>
									名前 <Text style={styles.required}>*</Text>
								</Text>
								<Text style={styles.charCount}>0/50</Text>
							</View>
							<TextInput
								style={styles.input}
								value={itemName}
								onChangeText={setItemName}
								maxLength={50}
								placeholder="名前を入力"
								placeholderTextColor="#999"
							/>
						</View>

						{/* Author */}
						<View style={styles.formGroup}>
							<View style={styles.labelRow}>
								<Text style={styles.label}>作者名</Text>
								<Text style={styles.charCount}>{authorName.length}/50</Text>
							</View>
							<TextInput
								style={styles.input}
								value={authorName}
								onChangeText={setAuthorName}
								maxLength={50}
								placeholder="作者名を入力"
								placeholderTextColor="#999"
							/>
						</View>

						{/* URL */}
						<View style={styles.formGroup}>
							<View style={styles.labelRow}>
								<Text style={styles.label}>URL</Text>
								<Text style={styles.charCount}>{url.length}/200</Text>
							</View>
							<TextInput
								style={styles.input}
								value={url}
								onChangeText={setUrl}
								maxLength={200}
								placeholder="URLを入力"
								placeholderTextColor="#999"
								keyboardType="url"
								autoCapitalize="none"
							/>
						</View>

						{/* Image */}
						<View style={styles.formGroup}>
							<Text style={styles.label}>画像</Text>
							<Pressable style={styles.imageUpload} onPress={handlePickImage}>
								{image ? (
									<View style={styles.imagePreview} />
								) : (
									<Ionicons name="add" size={40} color="#999" />
								)}
							</Pressable>
						</View>

						{/* Create Button */}
					<Pressable 
						style={[styles.createButton, isLoading && styles.createButtonDisabled]} 
						onPress={handleCreate}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator size="small" color="#fff" />
						) : (
							<Text style={styles.createButtonText}>作成</Text>
						)}
						</Pressable>
					</View>
				)}
			</ScrollView>

			{/* Genre Modal */}
			<Modal
				visible={showGenreModal}
				transparent
				animationType="fade"
				onRequestClose={() => setShowGenreModal(false)}
			>
				<Pressable style={styles.modalOverlay} onPress={() => setShowGenreModal(false)}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>ジャンルを選択</Text>
						{genres.map((g) => (
							<Pressable
								key={g}
								style={styles.modalItem}
								onPress={() => {
									setGenre(g);
									setShowGenreModal(false);
								}}
							>
								<Text style={[styles.modalItemText, g === genre && styles.modalItemSelected]}>
									{g}
								</Text>
								{g === genre && <Ionicons name="checkmark" size={24} color="#F2ABAF" />}
							</Pressable>
						))}
					</View>
				</Pressable>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 60,
		paddingHorizontal: 24,
		paddingBottom: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#E8E8E8",
	},
	closeButton: {
		position: "absolute",
		left: 16,
		top: 56,
		zIndex: 10,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#5A5A5A",
		textAlign: "center",
		flex: 1,
	},
	tabContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 16,
		gap: 16,
	},
	tab: {
		paddingHorizontal: 32,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#E8E8E8",
	},
	activeTab: {
		backgroundColor: "#5A5A5A",
	},
	tabText: {
		fontSize: 16,
		color: "#666",
		fontWeight: "500",
	},
	activeTabText: {
		color: "#fff",
	},
	content: {
		flex: 1,
	},
	searchTab: {
		paddingHorizontal: 24,
		paddingTop: 8,
	},
	genreSelector: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		gap: 8,
		marginBottom: 16,
	},
	genreText: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 24,
		gap: 8,
		marginBottom: 24,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	resultsList: {
		gap: 0,
	},
	resultItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	resultImage: {
		width: 56,
		height: 56,
		backgroundColor: "#E8E8E8",
		borderRadius: 4,
		marginRight: 12,
	},
	resultInfo: {
		flex: 1,
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	resultSubtitle: {
		fontSize: 14,
		color: "#999",
	},
	addButton: {
		padding: 4,
	},
	manualTab: {
		paddingHorizontal: 24,
		paddingTop: 8,
		paddingBottom: 32,
	},
	formGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	required: {
		color: "#F2ABAF",
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	charCount: {
		fontSize: 12,
		color: "#999",
	},
	dropdown: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		gap: 8,
	},
	dropdownText: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	input: {
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		fontSize: 16,
		color: "#333",
	},
	imageUpload: {
		width: "100%",
		height: 180,
		backgroundColor: "#F5F5F5",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderStyle: "dashed",
	},
	imagePreview: {
		width: "100%",
		height: "100%",
		backgroundColor: "#E8E8E8",
		borderRadius: 8,
	},
	createButton: {
		backgroundColor: "#F2ABAF",
		paddingVertical: 16,
		borderRadius: 24,
		alignItems: "center",
		marginTop: 16,
	},
	createButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
	},
	createButtonDisabled: {
		opacity: 0.5,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		width: "80%",
		maxHeight: "70%",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 16,
		textAlign: "center",
	},
	modalItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	modalItemText: {
		fontSize: 16,
		color: "#333",
	},
	modalItemSelected: {
		color: "#F2ABAF",
		fontWeight: "600",
	},
});
