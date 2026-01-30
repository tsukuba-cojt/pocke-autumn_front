import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TextInput,
	Pressable,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";
import { getToken, clearToken } from "../utils/tokenManager";
import ScreenHeader, { screenHeaderStyles } from "../components/ScreenHeader";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "CreateCommunity">;
};

export default function CreateCommunityScreen({ navigation }: Props) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [communityImage, setCommunityImage] = useState<string | null>(null);
	const [uploadedIconUrl, setUploadedIconUrl] = useState<string | null>(null);

	const handleNameChange = (value: string) => {
		setName(value.slice(0, 50));
	};

	const handleDescriptionChange = (value: string) => {
		setDescription(value.slice(0, 50));
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("写真へのアクセス許可が必要です");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			setCommunityImage(result.assets[0].uri);
			// 画像をアップロード
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
					console.log("画像アップロード成功:", data);
					// サーバーから返されたURLを保存
					if (data.result?.variants?.[0]) {
						setUploadedIconUrl(data.result.variants[0]);
					}
				} else {
					console.error("画像アップロード失敗:", response.status);
					alert("画像のアップロードに失敗しました");
				}
			} catch (error) {
				console.error("画像アップロードエラー:", error);
				alert("画像のアップロード中にエラーが発生しました");
			}
		}
	};

	const handleCreate = async () => {
		console.log("handleCreate called");
		if (!name.trim()) {
			alert("コミュニティ名を入力してください");
			return;
		}

		const token = await getToken();
		try {
			const response = await fetch("https://pocke-autumn-back.pocke-cojt.workers.dev/community/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: name,
					description: description || undefined,
					iconUrl: uploadedIconUrl || null,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				console.log("コミュニティ作成成功:", data);
				console.log("Response keys:", Object.keys(data));
				console.log("data.id:", data.id);
				console.log("data.communityId:", data.communityId);
				console.log("data.community?.id:", data.community?.id);
				console.log("Full data structure:", JSON.stringify(data, null, 2));
				const communityId = data.community?.id || data.id || data.communityId || data.community_id || "";
				
				if (!communityId) {
					console.error("Community ID not found in response:", data);
					alert("コミュニティIDが取得できませんでした");
					return;
				}
				console.log("Using communityId:", communityId);
				
				// inviteCodeもcommunityオブジェクトの中にある可能性を考慮
				const inviteCode = data.inviteCode || data.community?.inviteCode;
				
				console.log("Token for join request:", token ? `${token.substring(0, 20)}...` : "No token");
				
				// 作成者自身をコミュニティに管理者として参加させる
				try {
					const joinResponse = await fetch(`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${communityId}/members`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
						body: JSON.stringify({
							authority: "admin",
						}),
					});
					
					console.log("Join response status:", joinResponse.status);
					console.log("Join response ok:", joinResponse.ok);
					
					if (joinResponse.ok) {
						console.log("コミュニティへの参加成功（管理者として）");
					} else if (joinResponse.status === 401) {
						console.error("認証エラー: トークンが無効または期限切れです");
						alert("セッション切れ\n再度ログインしてください");
						await clearToken();
						let rootNavigation = navigation.getParent();
						while (rootNavigation?.getParent()) {
							rootNavigation = rootNavigation.getParent();
						}
						if (rootNavigation) {
							rootNavigation.dispatch(
								CommonActions.reset({
									index: 0,
									routes: [{ name: 'Auth' }],
								})
							);
						}
						return;
					} else if (joinResponse.status === 409) {
						console.log("既にメンバーとして登録されています（これは正常です）");
					} else {
						const responseText = await joinResponse.text();
						console.error("コミュニティへの参加失敗 status:", joinResponse.status);
						console.error("Response text:", responseText);
						// JSONとしてパースできる場合のみパース
						try {
							const errorData = JSON.parse(responseText);
							console.error("Error data:", errorData);
						} catch {
							console.error("Response is not JSON:", responseText);
						}
					}
				} catch (joinError) {
					console.error("コミュニティ参加エラー:", joinError);
				}
				// 完了画面へ遷移
				console.log("Attempting navigation to CommunityCreated");
				navigation.navigate("CommunityCreated", {
					communityId: communityId,
					communityName: name,
					inviteCode: inviteCode,
				});
				console.log("Navigation called successfully");
			} else {
				const errorData = await response.json();
				console.error("コミュニティ作成失敗:", errorData);
				alert("コミュニティの作成に失敗しました");
			}
		} catch (error) {
			console.error("コミュニティ作成エラー:", error);
			alert("コミュニティの作成中にエラーが発生しました");
		}
	};

	return (
		<View style={styles.container}>
			<ScreenHeader
				title="コミュニティの作成"
				leftIcon="close"
				onLeftPress={() => navigation.goBack()}
			/>

			{/* Content */}
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Name Field */}
				<View style={styles.fieldGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>名前</Text>
						<Text style={styles.requiredMark}>*</Text>
						<Text style={styles.counter}>{name.length}/50</Text>
					</View>
					<TextInput
						value={name}
						onChangeText={handleNameChange}
						style={styles.input}
						placeholder=""
						placeholderTextColor="#999"
					/>
				</View>

				{/* Description Field */}
				<View style={styles.fieldGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>説明</Text>
						<Text style={styles.counter}>{description.length}/50</Text>
					</View>
					<TextInput
						value={description}
						onChangeText={handleDescriptionChange}
						style={styles.input}
						placeholder=""
						placeholderTextColor="#999"
						multiline
						numberOfLines={3}
					/>
				</View>

				{/* Image Field */}
				<View style={styles.fieldGroup}>
					<Text style={styles.label}>画像</Text>
					<Pressable
						style={styles.imagePlaceholder}
						onPress={pickImage}
					>
						{communityImage ? (
							<Image
								source={{ uri: communityImage }}
								style={styles.communityImage}
							/>
						) : (
							<Ionicons name="add" size={48} color="#D0D0D0" />
						)}
					</Pressable>
				</View>

				{/* Create Button */}
				<Pressable
					style={styles.createButton}
					onPress={handleCreate}
				>
					<Text style={styles.createButtonText}>作成</Text>
				</Pressable>
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
	contentContainer: {
		paddingHorizontal: 24,
		paddingVertical: 24,
	},
	fieldGroup: {
		marginBottom: 24,
	},
	labelRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		gap: 4,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#343D45",
	},
	requiredMark: {
		fontSize: 14,
		fontWeight: "600",
		color: "#F2ABAF",
	},
	counter: {
		fontSize: 12,
		color: "#999",
		marginLeft: "auto",
	},
	input: {
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		fontSize: 14,
		color: "#343D45",
		minHeight: 44,
	},
	imagePlaceholder: {
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		height: 160,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	communityImage: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},
	createButton: {
		backgroundColor: "#F2ABAF",
		paddingVertical: 14,
		borderRadius: 24,
		alignItems: "center",
		marginTop: 8,
		marginBottom: 32,
	},
	createButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
