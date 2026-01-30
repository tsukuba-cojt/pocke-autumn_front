import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Dimensions,
	Modal,
	FlatList,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "../utils/tokenManager";

type CreateListScreenNavigationProp = NativeStackNavigationProp<
	HomeStackParamList,
	"CreateList"
>;

type Props = {
	navigation: CreateListScreenNavigationProp;
	route: {
		params: {
			communityId: string;
		};
	};
};

const { width } = Dimensions.get("window");

const MAX_LIST_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 50;

const genres = [
	{ id: "books", name: "書籍", icon: "book-open-variant" },
	{ id: "magazine", name: "雑誌", icon: "newspaper-variant" },
	{ id: "movie", name: "映画", icon: "movie-open" },
	{ id: "manga", name: "マンガ", icon: "book" },
	{ id: "anime", name: "アニメ", icon: "television" },
	{ id: "music", name: "音楽", icon: "music" },
	{ id: "place", name: "場所", icon: "map-marker" },
	{ id: "food", name: "料理", icon: "food" },
	{ id: "tourism", name: "観光地", icon: "beach" },
	{ id: "service", name: "サービス", icon: "application" },
	{ id: "app", name: "アプリ", icon: "cellphone" },
];

export default function CreateListScreen({ navigation, route }: Props) {
	const { communityId } = route.params;
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedThumbnails, setSelectedThumbnails] = useState<string[]>([]);
	const [selectedGenre, setSelectedGenre] = useState(genres[0]);
	const [showGenreModal, setShowGenreModal] = useState(false);
	const [listName, setListName] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleClose = () => {
		navigation.goBack();
	};

	const handlePickMainImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
		}
	};

	const handlePickThumbnails = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsMultipleSelection: true,
			quality: 1,
		});

		if (!result.canceled) {
			const uris = result.assets.map((asset) => asset.uri);
			setSelectedThumbnails([...selectedThumbnails, ...uris].slice(0, 12));
		}
	};

	const handleComplete = async () => {
		if (!listName.trim()) {
			Alert.alert("エラー", "リスト名を入力してください");
			return;
		}

		setIsLoading(true);
		const token = await getToken();

		const requestBody = {
			name: listName.trim(),
			description: description.trim() || null,
			thumbnailUrl: selectedImage || null,
			genreName: selectedGenre.name,
		};

		console.log("リクエストボディ:", requestBody);
		console.log("コミュニティID:", communityId);

		try {
			const response = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${communityId}/lists`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(requestBody),
				}
			);

			console.log("レスポンスステータス:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("リスト作成成功:", data);
				
				// 作成したリストの詳細画面に遷移
				if (data?.list?.id) {
					navigation.replace("ListDetail", { id: data.list.id });
				} else {
					navigation.goBack();
				}
			} else {
				const errorText = await response.text();
				console.error("リスト作成失敗:", response.status, errorText);
				Alert.alert("エラー", `リストの作成に失敗しました\n\nステータス: ${response.status}\n詳細: ${errorText}`);
			}
		} catch (error) {
			console.error("リスト作成エラー:", error);
			Alert.alert("エラー", `リストの作成に失敗しました\n\n${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
					<View style={styles.closeIconContainer}>
						<Ionicons name="close" size={24} color="#333" />
					</View>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>リスト作成</Text>
				<View style={styles.headerSpacer} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Image Section */}
				<View style={styles.imageSection}>
					<TouchableOpacity
						style={styles.mainImageContainer}
						onPress={handlePickMainImage}
					>
						<View style={styles.mainImagePlaceholder} />
					</TouchableOpacity>

					<View style={styles.rightSection}>
						{/* Circular Thumbnails */}
						<View style={styles.circularThumbnailRow}>
							{Array.from({ length: 5 }, (_, i) => i).map((index) => (
								<TouchableOpacity
									key={`circular-${index}`}
									style={styles.circularThumbnail}
									onPress={handlePickThumbnails}
								>
									<View style={styles.circularPlaceholder} />
								</TouchableOpacity>
							))}
						</View>

						{/* Book Icons Grid */}
						<View style={styles.bookIconsGrid}>
							{Array.from({ length: 10 }, (_, i) => i).map((index) => (
								<TouchableOpacity
									key={`book-${index}`}
									style={styles.bookIconContainer}
									onPress={handlePickThumbnails}
								>
									<MaterialCommunityIcons
										name="book-open-variant"
										size={24}
										color="#999"
									/>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>

				{/* Genre Selection */}
				<View style={styles.formGroup}>
					<Text style={styles.label}>ジャンル</Text>
					<Text style={styles.genreDescription}>
						検索時のデフォルトのジャンルを決定します。設定したジャンル以外のアイテムの追加も可能です。
					</Text>
					<TouchableOpacity
						style={styles.dropdownButton}
						onPress={() => setShowGenreModal(true)}
					>
						<View style={styles.dropdownLeft}>
							<MaterialCommunityIcons
								name={selectedGenre.icon as any}
								size={20}
								color="#5B7FAD"
							/>
							<Text style={styles.dropdownText}>{selectedGenre.name}</Text>
						</View>
						<Ionicons name="chevron-down" size={20} color="#999" />
					</TouchableOpacity>
				</View>

				{/* List Name */}
				<View style={styles.formGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>
							リスト名<Text style={styles.required}>*</Text>
						</Text>
						<Text style={styles.charCount}>
							{listName.length}/{MAX_LIST_NAME_LENGTH}
						</Text>
					</View>
					<TextInput
						style={styles.input}
						value={listName}
						onChangeText={(text) => {
							if (text.length <= MAX_LIST_NAME_LENGTH) {
								setListName(text);
							}
						}}
						placeholder=""
						maxLength={MAX_LIST_NAME_LENGTH}
					/>
				</View>

				{/* Description */}
				<View style={styles.formGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>説明</Text>
						<Text style={styles.charCount}>
							{description.length}/{MAX_DESCRIPTION_LENGTH}
						</Text>
					</View>
					<TextInput
						style={[styles.input, styles.textArea]}
						value={description}
						onChangeText={(text) => {
							if (text.length <= MAX_DESCRIPTION_LENGTH) {
								setDescription(text);
							}
						}}
						placeholder=""
						multiline
						numberOfLines={4}
						textAlignVertical="top"
						maxLength={MAX_DESCRIPTION_LENGTH}
					/>
				</View>
			</ScrollView>

			{/* Add Button */}
			<View style={styles.footer}>
				<TouchableOpacity 
					style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
					onPress={handleComplete}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						<Text style={styles.addButtonText}>追加</Text>
					)}
				</TouchableOpacity>
			</View>

			{/* Genre Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={showGenreModal}
				onRequestClose={() => setShowGenreModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>ジャンルを選択</Text>
							<TouchableOpacity onPress={() => setShowGenreModal(false)}>
								<Ionicons name="close" size={24} color="#666" />
							</TouchableOpacity>
						</View>
						<FlatList
							data={genres}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.genreItem}
									onPress={() => {
										setSelectedGenre(item);
										setShowGenreModal(false);
									}}
								>
									<View style={styles.genreItemLeft}>
										<MaterialCommunityIcons
											name={item.icon as any}
											size={24}
											color="#5B7FAD"
										/>
										<Text style={styles.genreItemText}>{item.name}</Text>
									</View>
									{selectedGenre.id === item.id && (
										<Ionicons name="checkmark" size={24} color="#F2ABAF" />
									)}
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#6B7A8C",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingTop: 60,
		paddingBottom: 16,
		backgroundColor: "#6B7A8C",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#fff",
	},
	closeButton: {
		padding: 4,
	},
	closeIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#D9D9D9",
		justifyContent: "center",
		alignItems: "center",
	},
	headerSpacer: {
		width: 48,
	},
	content: {
		flex: 1,
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	imageSection: {
		flexDirection: "row",
		padding: 20,
		gap: 16,
	},
	mainImageContainer: {
		width: (width - 72) * 0.48,
		aspectRatio: 1,
	},
	mainImagePlaceholder: {
		flex: 1,
		backgroundColor: "#D9D9D9",
		borderRadius: 12,
	},
	rightSection: {
		flex: 1,
		gap: 12,
	},
	circularThumbnailRow: {
		flexDirection: "row",
		gap: 8,
	},
	circularThumbnail: {
		width: 40,
		height: 40,
	},
	circularPlaceholder: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#D9D9D9",
	},
	bookIconsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	bookIconContainer: {
		width: 32,
		height: 32,
		justifyContent: "center",
		alignItems: "center",
	},
	formGroup: {
		paddingHorizontal: 20,
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		color: "#333",
		marginBottom: 8,
		fontWeight: "600",
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
	genreDescription: {
		fontSize: 12,
		color: "#666",
		lineHeight: 18,
		marginBottom: 12,
	},
	dropdownButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#E8F0F8",
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 8,
	},
	dropdownLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	dropdownText: {
		fontSize: 15,
		color: "#333",
		fontWeight: "500",
	},
	input: {
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 8,
		fontSize: 15,
		color: "#333",
	},
	textArea: {
		height: 120,
		paddingTop: 14,
	},
	footer: {
		padding: 20,
		backgroundColor: "#fff",
		alignItems: "center",
	},
	addButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#F2ABAF",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	addButtonDisabled: {
		opacity: 0.5,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: "70%",
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	genreItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#f5f5f5",
	},
	genreItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	genreItemText: {
		fontSize: 16,
		color: "#333",
	},
});
