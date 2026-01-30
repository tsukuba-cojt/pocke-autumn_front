import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TextInput,
	Pressable,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList>;
};

type SnsLink = {
	platform: string;
	url: string;
};

export default function EditProfileScreen({ navigation }: Props) {
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [bio, setBio] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);
	
	// SNSリンク
	const [xUrl, setXUrl] = useState("");
	const [instagramUrl, setInstagramUrl] = useState("");
	const [githubUrl, setGithubUrl] = useState("");
	const [otherUrl, setOtherUrl] = useState("");

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const token = await getToken();
			const response = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/me",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				const data = await response.json();
				const user = data.user;
				
				setUsername(user.username || "");
				setDisplayName(user.displayName || "");
				setBio(user.description || "");

				// SNSリンクを解析
				if (user.snsUrl && Array.isArray(user.snsUrl)) {
					user.snsUrl.forEach((sns: SnsLink) => {
						switch (sns.platform?.toLowerCase()) {
							case "x":
							case "twitter":
								setXUrl(sns.url || "");
								break;
							case "instagram":
								setInstagramUrl(sns.url || "");
								break;
							case "github":
								setGithubUrl(sns.url || "");
								break;
							case "other":
								setOtherUrl(sns.url || "");
								break;
						}
					});
				}
			}
		} catch (error) {
			console.error("プロフィール取得エラー:", error);
		} finally {
			setIsFetching(false);
		}
	};

	const handleSave = async () => {
		if (!username.trim()) {
			Alert.alert("エラー", "ユーザー名は必須です");
			return;
		}

		setIsLoading(true);
		try {
			const token = await getToken();
			
			// SNSリンクを配列に変換
			const snsUrls: SnsLink[] = [];
			if (xUrl.trim()) {
				snsUrls.push({ platform: "x", url: xUrl.trim() });
			}
			if (instagramUrl.trim()) {
				snsUrls.push({ platform: "instagram", url: instagramUrl.trim() });
			}
			if (githubUrl.trim()) {
				snsUrls.push({ platform: "github", url: githubUrl.trim() });
			}
			if (otherUrl.trim()) {
				snsUrls.push({ platform: "other", url: otherUrl.trim() });
			}

			const requestBody = {
				username: username.trim(),
				displayName: displayName.trim(),
				description: bio.trim(),
				snsUrl: snsUrls,
			};

			const response = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/me",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(requestBody),
				},
			);

			if (response.ok) {
				Alert.alert("成功", "プロフィールを更新しました", [
					{
						text: "OK",
						onPress: () => navigation.goBack(),
					},
				]);
			} else {
				const errorData = await response.json();
				Alert.alert("エラー", errorData.message || "プロフィールの更新に失敗しました");
			}
		} catch (error) {
			console.error("プロフィール保存エラー:", error);
			Alert.alert("エラー", "プロフィールの保存中にエラーが発生しました");
		} finally {
			setIsLoading(false);
		}
	};

	if (isFetching) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#007AFF" />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.container}>
				{/* ヘッダー */}
				<View style={styles.header}>
					<Pressable
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#000" />
					</Pressable>
					<Text style={styles.headerTitle}>プロフィール編集</Text>
					<View style={{ width: 24 }} />
				</View>

				<ScrollView style={styles.content}>
					{/* 基本情報セクション */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>基本情報</Text>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>
								ユーザー名 <Text style={styles.required}>*</Text>
							</Text>
							<TextInput
								style={styles.input}
								value={username}
								onChangeText={setUsername}
								placeholder="ユーザー名を入力"
								maxLength={50}
								autoCapitalize="none"
							/>
							<Text style={styles.helperText}>
								{username.length}/50文字
							</Text>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>表示名</Text>
							<TextInput
								style={styles.input}
								value={displayName}
								onChangeText={setDisplayName}
								placeholder="表示名を入力"
								maxLength={50}
							/>
							<Text style={styles.helperText}>
								{displayName.length}/50文字
							</Text>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.label}>自己紹介</Text>
							<TextInput
								style={[styles.input, styles.bioInput]}
								value={bio}
								onChangeText={setBio}
								placeholder="自己紹介を入力"
								multiline
								maxLength={200}
								textAlignVertical="top"
							/>
							<Text style={styles.helperText}>
								{bio.length}/200文字
							</Text>
						</View>
					</View>

					{/* SNSリンクセクション */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>SNSリンク</Text>
						<Text style={styles.sectionDescription}>
							各SNSのプロフィールURLを入力してください
						</Text>

						<View style={styles.inputGroup}>
							<View style={styles.snsLabelContainer}>
								<Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
								<Text style={styles.label}>X (Twitter)</Text>
							</View>
							<TextInput
								style={styles.input}
								value={xUrl}
								onChangeText={setXUrl}
								placeholder="https://x.com/username"
								autoCapitalize="none"
								keyboardType="url"
							/>
						</View>

						<View style={styles.inputGroup}>
							<View style={styles.snsLabelContainer}>
								<Ionicons name="logo-instagram" size={20} color="#E4405F" />
								<Text style={styles.label}>Instagram</Text>
							</View>
							<TextInput
								style={styles.input}
								value={instagramUrl}
								onChangeText={setInstagramUrl}
								placeholder="https://instagram.com/username"
								autoCapitalize="none"
								keyboardType="url"
							/>
						</View>

						<View style={styles.inputGroup}>
							<View style={styles.snsLabelContainer}>
								<Ionicons name="logo-github" size={20} color="#333" />
								<Text style={styles.label}>GitHub</Text>
							</View>
							<TextInput
								style={styles.input}
								value={githubUrl}
								onChangeText={setGithubUrl}
								placeholder="https://github.com/username"
								autoCapitalize="none"
								keyboardType="url"
							/>
						</View>

						<View style={styles.inputGroup}>
							<View style={styles.snsLabelContainer}>
								<Ionicons name="link-outline" size={20} color="#666" />
								<Text style={styles.label}>その他のリンク</Text>
							</View>
							<TextInput
								style={styles.input}
								value={otherUrl}
								onChangeText={setOtherUrl}
								placeholder="https://example.com"
								autoCapitalize="none"
								keyboardType="url"
							/>
						</View>
					</View>

					{/* 保存ボタン */}
					<Pressable
						style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
						onPress={handleSave}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.saveButtonText}>保存する</Text>
						)}
					</Pressable>

					<View style={{ height: 40 }} />
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#343D45",
	},
	content: {
		flex: 1,
	},
	section: {
		padding: 20,
		borderBottomWidth: 8,
		borderBottomColor: "#f5f5f5",
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
		color: "#343D45",
	},
	sectionDescription: {
		fontSize: 13,
		color: "#666",
		marginBottom: 16,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 8,
		color: "#343D45",
	},
	required: {
		color: "#ff3b30",
	},
	snsLabelContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
		color: "#343D45",
	},
	bioInput: {
		height: 100,
		paddingTop: 12,
	},
	helperText: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
		textAlign: "right",
	},
	saveButton: {
		backgroundColor: "#F2ABAF",
		margin: 16,
		marginTop: 24,
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	saveButtonDisabled: {
		opacity: 0.6,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
