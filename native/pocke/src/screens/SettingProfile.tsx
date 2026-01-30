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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList, MainTabParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList>;
};

export default function SettingProfile({ navigation: _ }: Props) {
	const tabNavigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>();
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [bio, setBio] = useState("");
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [uploadedIconUrl, setUploadedIconUrl] = useState<string | null>(null);

	const handleUsernameChange = (value: string) => {
		setUsername(value.slice(0, 50));
	};

	const handleDisplayNameChange = (value: string) => {
		setDisplayName(value.slice(0, 50));
	};

	const handleBioChange = (value: string) => {
		setBio(value.slice(0, 200));
	};

	const handleSave = async () => {
		console.log("=== プロフィール保存開始 ===");
		const token = await getToken();
		console.log("Token:", token ? `${token.substring(0, 20)}...` : "No token");
		
		if (!username || !displayName) {
			console.log("バリデーションエラー: ユーザー名または表示名が空です");
			console.log("Username:", username);
			console.log("DisplayName:", displayName);
			alert("ユーザー名と表示名は必須です");
			return;
		}
		
		const requestBody = {
			username: username,
			displayName: displayName,
			description: bio,
			iconUrl: uploadedIconUrl || undefined,
		};
		console.log("リクエストボディ:", JSON.stringify(requestBody, null, 2));
		
		try {
			console.log("API呼び出し開始: PATCH /me");
			const response = await fetch("https://pocke-autumn-back.pocke-cojt.workers.dev/me", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify(requestBody),
			});
			
			console.log("レスポンスステータス:", response.status);
			console.log("レスポンスOK:", response.ok);
			
			if (response.ok) {
				const responseData = await response.json();
				console.log("プロフィール保存成功");
				console.log("レスポンスデータ:", JSON.stringify(responseData, null, 2));
				tabNavigation.navigate("Home");
			} else {
				const errorData = await response.json();
				console.error("プロフィール保存失敗:", errorData);
				console.error("エラーステータス:", response.status);
				alert("プロフィールの保存に失敗しました");
			}
		} catch (error) {
			console.error("プロフィール保存エラー:", error);
			alert("プロフィールの保存中にエラーが発生しました");
		}
		console.log("=== プロフィール保存処理終了 ===");
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
			setProfileImage(result.assets[0].uri);

			// 画像をアップロード
			const uploadUri = "https://pocke-autumn-back.pocke-cojt.workers.dev/images/upload";
			const token = await getToken();

			try {
				const formData = new FormData();
				const imageUri = result.assets[0].uri;
				const filename = imageUri.split('/').pop() || 'photo.jpg';
				const match = /\.(\w+)$/.exec(filename);
				const type = match ? `image/${match[1]}` : 'image/jpeg';
				
				// @ts-ignore
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
					if (data.image.variants?.[0]) {
						setUploadedIconUrl(data.image.variants[0]);
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

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<View style={styles.headerArea}>
				<Text style={styles.title}>プロフィール設定</Text>
				<Text style={styles.subtitle}>pockeへようこそ！</Text>
				<Text style={styles.subtitle}>まずはプロフィールを設定しましょう</Text>
			</View>

			<View style={styles.card}>
				<View style={styles.avatarRow}>
					<Pressable style={styles.avatarPlaceholder} onPress={pickImage}>
						{profileImage ? (
							<Image source={{ uri: profileImage }} style={styles.avatarImage} />
						) : (
							<Ionicons name="person" size={45} color="#EFF2F6" />
						)}
					</Pressable>
					<Text style={styles.uploadText}>画像をアップロード</Text>
				</View>

				<View style={styles.fieldGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>ユーザ名</Text>
						<Text style={styles.requiredMark}>*</Text>
						<Text style={styles.counter}>{username.length}/50</Text>
					</View>
					<TextInput
						value={username}
						onChangeText={handleUsernameChange}
						style={styles.input}
						placeholder=""
						placeholderTextColor="#999"
					/>
				</View>

				<View style={styles.fieldGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>表示名</Text>
						<Text style={styles.requiredMark}>*</Text>
						<Text style={styles.counter}>{displayName.length}/50</Text>
					</View>
					<TextInput
						value={displayName}
						onChangeText={handleDisplayNameChange}
						style={styles.input}
						placeholder=""
						placeholderTextColor="#999"
					/>
				</View>

				<View style={styles.fieldGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>自己紹介</Text>
						<Text style={styles.counter}>{bio.length}/200</Text>
					</View>
					<TextInput
						value={bio}
						onChangeText={handleBioChange}
						style={[styles.input, styles.textArea]}
						multiline
						textAlignVertical="top"
						placeholder=""
						placeholderTextColor="#999"
					/>
				</View>

				<View style={styles.footer}>
				<Pressable style={styles.saveButton} onPress={handleSave}>
						<Text style={styles.saveButtonText}>保存</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	content: {
		padding: 24,
		paddingBottom: 48,
	},
	headerArea: {
		alignItems: "center",
		gap: 4,
        marginTop: 80,
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#343D45",
	},
	subtitle: {
		fontSize: 16,
		color: "#7A848C",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 20,
		gap: 24,
	},
	avatarRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	avatarPlaceholder: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#343D45",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	avatarImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
	},
	uploadText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#343D45",
	},
	fieldGroup: {
		gap: 8,
	},
	labelRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	label: {
		fontSize: 16,
		fontWeight: "700",
		color: "#343D45",
	},
	requiredMark: {
		fontSize: 18,
		color: "#F2ABAF",
	},
	counter: {
		marginLeft: "auto",
		fontSize: 14,
		color: "#7A848C",
	},
	input: {
		backgroundColor: "#EEF2F6",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: "#343D45",
	},
	textArea: {
		height: 140,
	},
	footer: {
		alignItems: "center",
		marginTop: 8,
	},
	saveButton: {
		backgroundColor: "#F2ABAF",
		paddingHorizontal: 48,
		paddingVertical: 14,
		borderRadius: 24,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
	},
});
