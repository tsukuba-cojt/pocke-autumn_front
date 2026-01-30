import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Image,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "CommunitySettings">;
	route: RouteProp<HomeStackParamList, "CommunitySettings">;
};

const MAX_NAME_LENGTH = 50;

type Member = {
	id: string;
	username: string;
	displayName?: string;
	authority: "admin" | "member";
	iconUrl?: string;
};

export default function CommunitySettingsScreen({ navigation, route }: Props) {
	const { id } = route.params;

	const [communityName, setCommunityName] = useState("");
	const [communityImage, setCommunityImage] = useState<string | null>(null);
	const [uploadedIconUrl, setUploadedIconUrl] = useState<string | null>(null);
	const [members, setMembers] = useState<Member[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		fetchCommunityData();
	}, [id]);

	const fetchCommunityData = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				console.error("No token found");
				return;
			}

			// Fetch community details
			const communityResponse = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (communityResponse.ok) {
				const communityData = await communityResponse.json();
				console.log("Community data:", communityData);
				console.log("Community iconUrl:", communityData.iconUrl);
				setCommunityName(communityData.name || "");
				const imageUrl = communityData.iconUrl || null;
				console.log("Setting communityImage to:", imageUrl);
				setCommunityImage(imageUrl);
				setUploadedIconUrl(imageUrl);
			} else {
				console.error("Failed to fetch community details:", communityResponse.status);
			}

			// Fetch community members
			const membersResponse = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}/members`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (membersResponse.ok) {
				const data = await membersResponse.json();
				console.log("Members data:", data);
				setMembers(data.members || []);
			} else {
				console.error("Failed to fetch members:", membersResponse.status);
			}
		} catch (error) {
			console.error("Error fetching community data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("権限エラー", "写真へのアクセス許可が必要です");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			setCommunityImage(result.assets[0].uri);
			
			// 画像をサーバーにアップロード
			const uploadUri = "https://pocke-autumn-back.pocke-cojt.workers.dev/images/upload";
			const token = await getToken();

			try {
				const formData = new FormData();
				const imageUri = result.assets[0].uri;
				const filename = imageUri.split('/').pop() || 'photo.jpg';
				const match = /\.(\w+)$/.exec(filename);
				const type = match ? `image/${match[1]}` : 'image/jpeg';
				
				// @ts-ignore - React Native FormData accepts this format
				formData.append('file', {
					uri: imageUri,
					name: filename,
					type: type,
				});
				
				const response = await fetch(uploadUri, {
					method: "POST",
					headers: {
						"Authorization": `Bearer ${token}`,
					},
					body: formData,
				});
				
				if (response.ok) {
					const data = await response.json();
				console.log("=== 画像アップロード成功 ===");
				console.log("完全なレスポンス:", JSON.stringify(data, null, 2));
					// サーバーから返されたURLを保存
					if (data.result?.variants?.[0]) {
					const uploadedUrl = data.result.variants[0];
					console.log("uploadedIconUrlに設定:", uploadedUrl);
					setUploadedIconUrl(uploadedUrl);
					// 表示用のcommunityImageも更新
					setCommunityImage(uploadedUrl);
				} else {
					console.warn("画像URLがレスポンスに見つかりません");
					}
				} else {
					console.error("画像アップロード失敗:", response.status);
					Alert.alert("エラー", "画像のアップロードに失敗しました");
				}
			} catch (error) {
				console.error("画像アップロードエラー:", error);
				Alert.alert("エラー", "画像のアップロード中にエラーが発生しました");
			}
		}
	};

	const handleSave = async () => {
		if (!communityName.trim()) {
			Alert.alert("エラー", "コミュニティ名は必須です");
			return;
		}

		setIsSaving(true);
		try {
			const token = await getToken();
			if (!token) {
				Alert.alert("エラー", "認証トークンが見つかりません");
				return;
			}

			const requestBody: { name: string; iconUrl?: string } = {
				name: communityName.trim(),
			};

			console.log("=== コミュニティ更新準備 ===");
			console.log("uploadedIconUrl:", uploadedIconUrl);
			console.log("communityImage:", communityImage);
			
			// アップロードされた画像URLがある場合は使用
			if (uploadedIconUrl) {
				console.log("iconUrlを設定:", uploadedIconUrl);
				requestBody.iconUrl = uploadedIconUrl;
			} else {
				console.log("uploadedIconUrlが空のため、iconUrlは送信されません");
			}

			console.log("Updating community:", id);
			console.log("Request body:", JSON.stringify(requestBody, null, 2));

			const response = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(requestBody),
				}
			);

			console.log("Update response status:", response.status);

			if (response.ok) {
				Alert.alert("成功", "コミュニティ情報を更新しました", [
					{
						text: "OK",
						onPress: () => navigation.goBack(),
					},
				]);
			} else {
				const errorData = await response.json().catch(() => null);
				console.error("Update failed:", errorData);
				Alert.alert(
					"エラー",
					errorData?.message || "コミュニティ情報の更新に失敗しました"
				);
			}
		} catch (error) {
			console.error("Error saving community:", error);
			Alert.alert("エラー", "コミュニティ情報の保存中にエラーが発生しました");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons name="close" size={28} color="#fff" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>設定</Text>
				<TouchableOpacity 
					onPress={handleSave} 
					style={styles.saveButton}
					disabled={isSaving}
				>
					{isSaving ? (
						<ActivityIndicator size="small" color="#F2ABAF" />
					) : (
						<Text style={styles.saveButtonText}>保存</Text>
					)}
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#F2ABAF" />
					</View>
				) : (
					<>
						{/* Community Image */}
						<View style={styles.imageSection}>
							<TouchableOpacity
								style={styles.imageContainer}
								onPress={handlePickImage}
							>
								{communityImage ? (
									<Image 
										source={{ uri: communityImage }} 
										style={styles.image}
										onError={(error) => console.error("Image load error:", error.nativeEvent.error)}
										onLoad={() => console.log("Image loaded successfully:", communityImage)}
									/>
								) : (
									<View style={styles.imagePlaceholder} />
								)}
							</TouchableOpacity>
							<TouchableOpacity onPress={handlePickImage}>
								<Text style={styles.changeImageText}>画像を変更する</Text>
							</TouchableOpacity>
							{/* Debug: Show current image URL */}
							{communityImage && (
								<Text style={styles.debugText} numberOfLines={2}>
									URL: {communityImage}
								</Text>
							)}
						</View>

						{/* Community Name */}
						<View style={styles.formGroup}>
							<View style={styles.labelRow}>
								<Text style={styles.label}>コミュニティ名</Text>
								<Text style={styles.charCount}>
									{communityName.length}/{MAX_NAME_LENGTH}
								</Text>
							</View>
							<TextInput
								style={styles.input}
								value={communityName}
								onChangeText={(text) => {
									if (text.length <= MAX_NAME_LENGTH) {
										setCommunityName(text);
									}
								}}
								placeholder=""
								maxLength={MAX_NAME_LENGTH}
							/>
						</View>

						{/* Members Section */}
						<View style={styles.membersSection}>
							<Text style={styles.sectionTitle}>メンバーの編集</Text>
							{members.length === 0 ? (
								<View style={styles.emptyMembers}>
									<Text style={styles.emptyText}>メンバーがいません</Text>
								</View>
							) : (
								members.map((member) => (
									<View key={member.id} style={styles.memberItem}>
										<View style={styles.memberLeft}>
											<View style={styles.avatar}>
												{member.iconUrl ? (
													<Image source={{ uri: member.iconUrl }} style={styles.avatarImage} />
												) : (
													<View style={styles.avatarPlaceholder} />
												)}
											</View>
											<Text style={styles.memberName}>
												{member.displayName || member.username}
											</Text>
										</View>
										<View
											style={[
												styles.roleBadge,
												member.authority === "admin"
													? styles.adminBadge
													: styles.memberBadge,
											]}
										>
											<Text
												style={[
													styles.roleText,
													member.authority === "admin"
														? styles.adminText
														: styles.memberText,
												]}
											>
												{member.authority}
											</Text>
										</View>
									</View>
								))
							)}
						</View>
					</>
				)}
			</ScrollView>
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
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 50,
		paddingHorizontal: 20,
		paddingBottom: 16,
		backgroundColor: "#6B7A8C",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#fff",
		flex: 1,
		textAlign: "center",
	},
	saveButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1.5,
		borderColor: "#F2ABAF",
	},
	saveButtonText: {
		color: "#F2ABAF",
		fontSize: 14,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 60,
	},
	imageSection: {
		alignItems: "center",
		paddingTop: 32,
		paddingBottom: 24,
		backgroundColor: "#fff",
	},
	imageContainer: {
		width: 160,
		height: 120,
		marginBottom: 16,
	},
	imagePlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#D9D9D9",
		borderRadius: 12,
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
	},
	changeImageText: {
		fontSize: 14,
		color: "#333",
	},
	formGroup: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		backgroundColor: "#fff",
		marginTop: 8,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	label: {
		fontSize: 14,
		color: "#333",
		fontWeight: "600",
	},
	charCount: {
		fontSize: 12,
		color: "#999",
	},
	input: {
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		fontSize: 15,
		color: "#333",
	},
	membersSection: {
		backgroundColor: "#fff",
		marginTop: 8,
		paddingVertical: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		paddingHorizontal: 20,
		marginBottom: 16,
		textAlign: "center",
	},
	emptyMembers: {
		paddingVertical: 40,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 14,
		color: "#999",
	},
	memberItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	memberLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	avatar: {
		width: 48,
		height: 48,
	},
	avatarPlaceholder: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#999",
	},
	avatarImage: {
		width: 48,
		height: 48,
		borderRadius: 24,
	},
	memberName: {
		fontSize: 15,
		color: "#333",
	},
	roleBadge: {
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 16,
	},
	adminBadge: {
		backgroundColor: "#FFE8E9",
	},
	memberBadge: {
		backgroundColor: "#E8E8E8",
	},
	roleText: {
		fontSize: 13,
		fontWeight: "500",
	},
	adminText: {
		color: "#F2ABAF",
	},
	memberText: {
		color: "#666",
	},
	debugText: {
		fontSize: 10,
		color: "#999",
		marginTop: 8,
		paddingHorizontal: 20,
		textAlign: "center",
	},
});
