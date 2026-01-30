import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, "ChangePassword">;

export default function ChangePasswordScreen() {
	const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChangePassword = async () => {
		// バリデーション
		if (!currentPassword || !newPassword || !confirmPassword) {
			Alert.alert("エラー", "すべての項目を入力してください");
			return;
		}

		if (newPassword !== confirmPassword) {
			Alert.alert("エラー", "新しいパスワードが一致しません");
			return;
		}

		// パスワードの強度チェック
		if (newPassword.length < 8) {
			Alert.alert("エラー", "パスワードは8文字以上である必要があります");
			return;
		}

		setIsLoading(true);

		try {
			const token = await getToken();
			if (!token) {
				Alert.alert("エラー", "ログインしてください");
				return;
			}

			const response = await fetch("https://pocke-autumn-back.pocke-cojt.workers.dev/me/password", {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentPassword,
					newPassword,
				}),
			});

			if (response.ok) {
				Alert.alert(
					"成功",
					"パスワードが変更されました",
					[
						{
							text: "OK",
							onPress: () => navigation.goBack(),
						},
					]
				);
			} else {
				const errorData = await response.json().catch(() => ({}));
				Alert.alert("エラー", errorData.message || "パスワードの変更に失敗しました");
			}
		} catch (error) {
			console.error("パスワード変更エラー:", error);
			Alert.alert("エラー", "パスワードの変更に失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
						<Ionicons name="arrow-back" size={24} color="#343D45" />
					</Pressable>
					<Text style={styles.headerTitle}>パスワード変更</Text>
					<View style={{ width: 40 }} />
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.form}>
						<Text style={styles.description}>
							パスワードを変更するには、現在のパスワードと新しいパスワードを入力してください。パスワードは8文字以上である必要があります。
						</Text>

						{/* 現在のパスワード */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>現在のパスワード</Text>
							<View style={styles.passwordContainer}>
								<TextInput
									style={styles.passwordInput}
									value={currentPassword}
									onChangeText={setCurrentPassword}
									placeholder="現在のパスワード"
									placeholderTextColor="#999"
									secureTextEntry={!showCurrentPassword}
									autoCapitalize="none"
								/>
								<Pressable
									style={styles.eyeIcon}
									onPress={() => setShowCurrentPassword(!showCurrentPassword)}
								>
									<Ionicons
										name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
										size={24}
										color="#999"
									/>
								</Pressable>
							</View>
						</View>

						{/* 新しいパスワード */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>新しいパスワード</Text>
							<View style={styles.passwordContainer}>
								<TextInput
									style={styles.passwordInput}
									value={newPassword}
									onChangeText={setNewPassword}
									placeholder="新しいパスワード（8文字以上）"
									placeholderTextColor="#999"
									secureTextEntry={!showNewPassword}
									autoCapitalize="none"
								/>
								<Pressable
									style={styles.eyeIcon}
									onPress={() => setShowNewPassword(!showNewPassword)}
								>
									<Ionicons
										name={showNewPassword ? "eye-outline" : "eye-off-outline"}
										size={24}
										color="#999"
									/>
								</Pressable>
							</View>
							{newPassword.length > 0 && newPassword.length < 8 && (
								<Text style={styles.errorText}>8文字以上入力してください</Text>
							)}
						</View>

						{/* 新しいパスワード（確認） */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>新しいパスワード（確認）</Text>
							<View style={styles.passwordContainer}>
								<TextInput
									style={styles.passwordInput}
									value={confirmPassword}
									onChangeText={setConfirmPassword}
									placeholder="新しいパスワード（確認）"
									placeholderTextColor="#999"
									secureTextEntry={!showConfirmPassword}
									autoCapitalize="none"
								/>
								<Pressable
									style={styles.eyeIcon}
									onPress={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									<Ionicons
										name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
										size={24}
										color="#999"
									/>
								</Pressable>
							</View>
							{confirmPassword.length > 0 && newPassword !== confirmPassword && (
								<Text style={styles.errorText}>パスワードが一致しません</Text>
							)}
						</View>

						{/* 変更ボタン */}
						<Pressable
							style={[styles.button, isLoading && styles.buttonDisabled]}
							onPress={handleChangePassword}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>パスワードを変更</Text>
							)}
						</Pressable>
					</View>
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
	form: {
		padding: 20,
	},
	description: {
		fontSize: 14,
		color: "#666",
		marginBottom: 24,
		lineHeight: 20,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: "#343D45",
		marginBottom: 8,
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderRadius: 8,
	},
	passwordInput: {
		flex: 1,
		padding: 12,
		fontSize: 16,
		color: "#343D45",
	},
	eyeIcon: {
		padding: 12,
	},
	errorText: {
		fontSize: 12,
		color: "#FF4444",
		marginTop: 4,
	},
	button: {
		backgroundColor: "#F2ABAF",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 12,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
