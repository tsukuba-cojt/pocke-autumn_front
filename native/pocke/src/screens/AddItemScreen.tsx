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

type SearchResult = {
	id: string;
	title: string;
	subtitle: string;
	imageUrl?: string;
	url?: string;
	author?: string;
};

type GenreType = "Spotify" | "GoogleBooks" | "Twitch" | "other";

const genreOptions = [
	{ label: "書籍", value: "GoogleBooks" as GenreType },
	{ label: "雑誌", value: "GoogleBooks" as GenreType },
	{ label: "映画", value: "other" as GenreType },
	{ label: "マンガ", value: "GoogleBooks" as GenreType },
	{ label: "アニメ", value: "other" as GenreType },
	{ label: "音楽", value: "Spotify" as GenreType },
	{ label: "ゲーム配信", value: "Twitch" as GenreType },
	{ label: "場所", value: "other" as GenreType },
	{ label: "料理", value: "other" as GenreType },
	{ label: "観光地", value: "other" as GenreType },
	{ label: "サービス", value: "other" as GenreType },
	{ label: "アプリ", value: "other" as GenreType },
];

export default function AddItemScreen({ navigation, route }: Props) {
	const { listId } = route.params;
	const [activeTab, setActiveTab] = useState<"search" | "manual">("search");
	const [genre, setGenre] = useState<GenreType>("Spotify");
	const [genreLabel, setGenreLabel] = useState("音楽");
	const [showGenreModal, setShowGenreModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [itemName, setItemName] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [url, setUrl] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// Search function
	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			let endpoint = "";
			const encodedQuery = encodeURIComponent(searchQuery.trim());

			// ジャンルに応じてAPIエンドポイントを選択
			if (genre === "Spotify") {
				endpoint = `https://pocke-autumn-back.pocke-cojt.workers.dev/search/spotify?q=${encodedQuery}`;
			} else if (genre === "Twitch") {
				endpoint = `https://pocke-autumn-back.pocke-cojt.workers.dev/search/twitch?q=${encodedQuery}`;
			} else if (genre === "GoogleBooks") {
				endpoint = `https://pocke-autumn-back.pocke-cojt.workers.dev/search/google-books?q=${encodedQuery}`;
			} else {
				// 他のジャンルはデフォルトで空の結果
				setSearchResults([]);
				setIsSearching(false);
				return;
			}

			console.log("=== 検索開始 ===");
			console.log("ジャンル:", genre);
			console.log("ジャンル表示名:", genreLabel);
			console.log("検索クエリ:", searchQuery);
			console.log("エンコード後:", encodeURIComponent(searchQuery));
			console.log("リクエストURL:", endpoint);

			const response = await fetch(endpoint);

			console.log("レスポンスステータス:", response.status);
			console.log("レスポンスヘッダー:", JSON.stringify(Object.fromEntries(response.headers.entries())));

			if (!response.ok) {
				const errorText = await response.text();
				console.error("=== 検索エラー ===");
				console.error("ステータス:", response.status);
				console.error("ステータステキスト:", response.statusText);
				console.error("エラーボディ:", errorText);
				console.error("URL:", endpoint);

				// サーバーエラーの場合は手動入力を提案
				if (response.status === 500) {
					Alert.alert(
						"検索サービスエラー",
						`現在、${genreLabel}の検索サービスが利用できません。\n\n「手動」タブから直接アイテムを追加してください。`,
						[
							{
								text: "手動で追加",
								onPress: () => setActiveTab("manual")
							},
							{
								text: "閉じる",
								style: "cancel"
							}
						]
					);
				} else {
					Alert.alert(
						"検索エラー",
						`検索に失敗しました (エラー: ${response.status})\n\n別のキーワードで試すか、「手動」タブから追加してください。`
					);
				}
				setSearchResults([]);
				return;
			}

			const data = await response.json();
			console.log("レスポンスデータ構造:", Object.keys(data));
			console.log("完全なレスポンス:", JSON.stringify(data).substring(0, 500));

			// APIレスポンスを統一フォーマットに変換
			let results: SearchResult[] = [];

			if (genre === "Spotify" && data.type === "spotify" && data.items) {
				// Spotify - 新しいAPI形式
				results = data.items.map((item: any) => ({
					id: item.url || item.title, // urlをIDとして使用
					title: item.title,
					subtitle: item.author,
					imageUrl: item.imageURL,
					url: item.url,
					author: item.author,
				}));
			} else if (genre === "Spotify" && data.tracks) {
				// Spotify - 旧API形式（後方互換性のため）
				results = data.tracks.items.map((track: any) => ({
					id: track.id,
					title: track.name,
					subtitle: track.artists.map((a: any) => a.name).join(", "),
					imageUrl: track.album?.images?.[0]?.url,
					url: track.external_urls?.spotify,
					author: track.artists.map((a: any) => a.name).join(", "),
				}));
			} else if (genre === "Twitch" && data.data) {
				// Twitch
				results = data.data.map((stream: any) => ({
					id: stream.id,
					title: stream.title,
					subtitle: `${stream.user_name} - ${stream.game_name}`,
					imageUrl: stream.thumbnail_url?.replace("{width}", "320").replace("{height}", "180"),
					url: `https://twitch.tv/${stream.user_login}`,
					author: stream.user_name,
				}));
			} else if (genre === "GoogleBooks" && data.items) {
				// Google Books
				results = data.items.map((book: any) => ({
					id: book.id,
					title: book.volumeInfo?.title || "タイトルなし",
					subtitle: book.volumeInfo?.authors?.join(", ") || "著者不明",
					imageUrl: book.volumeInfo?.imageLinks?.thumbnail,
					url: book.volumeInfo?.infoLink,
					author: book.volumeInfo?.authors?.join(", "),
				}));
			} else {
				console.warn("予期しないAPIレスポンス形式:", data);
			}

			console.log("変換後の検索結果数:", results.length);
			setSearchResults(results);
		} catch (error) {
			console.error("検索エラー:", error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			Alert.alert(
				"エラー",
				`検索中にエラーが発生しました\n\n${errorMessage}`
			);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	// 検索結果からアイテムを追加
	const handleAddFromSearch = async (result: SearchResult) => {
		setIsLoading(true);
		const token = await getToken();

		if (!token) {
			Alert.alert("エラー", "ログインしてください");
			setIsLoading(false);
			return;
		}

		try {
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

			const response = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/item/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						title: result.title,
						listId: listId,
						userId: userId,
						url: result.url || null,
						author: result.author || null,
						imageUrl: result.imageUrl || null,
						genreId: null,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log("アイテム作成成功:", data);
				Alert.alert("成功", "アイテムを追加しました");
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
							<Text style={styles.genreText}>{genreLabel}</Text>
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
								onSubmitEditing={handleSearch}
								returnKeyType="search"
							/>
							<Pressable onPress={handleSearch} disabled={isSearching}>
								<Text style={styles.searchButton}>検索</Text>
							</Pressable>
						</View>

						{/* Loading */}
						{isSearching && (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color="#F2ABAF" />
								<Text style={styles.loadingText}>検索中...</Text>
							</View>
						)}

						{/* Search Results */}
						{!isSearching && searchResults.length > 0 && (
							<View style={styles.resultsList}>
								{searchResults.map((item) => (
									<View key={`${item.id}-${item.title}`} style={styles.resultItem}>
										{item.imageUrl ? (
											<View style={styles.resultImageContainer}>
												<Text style={styles.resultImage}>🖼️</Text>
											</View>
										) : (
											<View style={styles.resultImage} />
										)}
										<View style={styles.resultInfo}>
											<Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
											<Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
										</View>
										<Pressable
											style={styles.addButton}
											onPress={() => handleAddFromSearch(item)}
											disabled={isLoading}
										>
											{isLoading ? (
												<ActivityIndicator size="small" color="#F2ABAF" />
											) : (
												<Ionicons name="add-circle-outline" size={28} color="#F2ABAF" />
											)}
										</Pressable>
									</View>
								))}
							</View>
						)}

						{/* No Results */}
						{!isSearching && searchQuery && searchResults.length === 0 && (
							<View style={styles.noResults}>
								<Ionicons name="search-outline" size={48} color="#ccc" />
								<Text style={styles.noResultsText}>検索結果が見つかりませんでした</Text>
								{genre === "other" && (
									<Text style={styles.noResultsHint}>
										このジャンルは検索に対応していません{"\n"}
										音楽、ゲーム配信、書籍から選択してください
									</Text>
								)}
							</View>
						)}
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
								<Text style={styles.dropdownText}>{genreLabel}</Text>
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
						{genreOptions.map((option) => (
							<Pressable
								key={option.label}
								style={styles.modalItem}
								onPress={() => {
									setGenre(option.value);
									setGenreLabel(option.label);
									setShowGenreModal(false);
								}}
							>
								<Text style={[styles.modalItemText, option.value === genre && styles.modalItemSelected]}>
									{option.label}
								</Text>
								{option.value === genre && <Ionicons name="checkmark" size={24} color="#F2ABAF" />}
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
	searchButton: {
		fontSize: 14,
		fontWeight: "600",
		color: "#F2ABAF",
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 40,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 14,
		color: "#999",
	},
	noResults: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
		paddingHorizontal: 32,
	},
	noResultsText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	noResultsHint: {
		marginTop: 8,
		fontSize: 14,
		color: "#999",
		textAlign: "center",
	},
	resultImageContainer: {
		width: 56,
		height: 56,
		backgroundColor: "#E8E8E8",
		borderRadius: 4,
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
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
