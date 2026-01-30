import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";

type ChangeEmailScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, "ChangeEmail">;

export default function ChangeEmailScreen() {
	const navigation = useNavigation<ChangeEmailScreenNavigationProp>();
	const [currentEmail, setCurrentEmail] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [confirmEmail, setConfirmEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleChangeEmail = async () => {
		// バリデーション
		if (!currentEmail || !newEmail || !confirmEmail || !password) {
			Alert.alert("エラー", "すべての項目を入力してください");
			return;
		}

		if (newEmail !== confirmEmail) {
			Alert.alert("エラー", "新しいメールアドレスが一致しません");
			return;
		}

		// メールアドレスの形式チェック
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			Alert.alert("エラー", "有効なメールアドレスを入力してください");
			return;
		}

		setIsLoading(true);

		try {
			const token = await getToken();
			if (!token) {
				Alert.alert("エラー", "ログインしてください");
				return;
			}

			const response = await fetch("https://pocke-autumn-back.pocke-cojt.workers.dev/me/email", {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentEmail,
					newEmail,
					password,
				}),
			});

			if (response.ok) {
				Alert.alert(
					"成功",
					"メールアドレスが変更されました",
					[
						{
							text: "OK",
							onPress: () => navigation.goBack(),
						},
					]
				);
			} else {
				const errorData = await response.json().catch(() => ({}));
				Alert.alert("エラー", errorData.message || "メールアドレスの変更に失敗しました");
			}
		} catch (error) {
			console.error("メールアドレス変更エラー:", error);
			Alert.alert("エラー", "メールアドレスの変更に失敗しました");
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
					<Text style={styles.headerTitle}>メールアドレス変更</Text>
					<View style={{ width: 40 }} />
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.form}>
						<Text style={styles.description}>
							メールアドレスを変更するには、現在のメールアドレス、新しいメールアドレス、およびパスワードを入力してください。
						</Text>

						{/* 現在のメールアドレス */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>現在のメールアドレス</Text>
							<TextInput
								style={styles.input}
								value={currentEmail}
								onChangeText={setCurrentEmail}
								placeholder="current@example.com"
								placeholderTextColor="#999"
								keyboardType="email-address"
								autoCapitalize="none"
								autoComplete="email"
							/>
						</View>

						{/* 新しいメールアドレス */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>新しいメールアドレス</Text>
							<TextInput
								style={styles.input}
								value={newEmail}
								onChangeText={setNewEmail}
								placeholder="new@example.com"
								placeholderTextColor="#999"
								keyboardType="email-address"
								autoCapitalize="none"
								autoComplete="email"
							/>
						</View>

						{/* 新しいメールアドレス（確認） */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>新しいメールアドレス（確認）</Text>
							<TextInput
								style={styles.input}
								value={confirmEmail}
								onChangeText={setConfirmEmail}
								placeholder="new@example.com"
								placeholderTextColor="#999"
								keyboardType="email-address"
								autoCapitalize="none"
								autoComplete="email"
							/>
						</View>

						{/* パスワード */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>パスワード</Text>
							<TextInput
								style={styles.input}
								value={password}
								onChangeText={setPassword}
								placeholder="現在のパスワード"
								placeholderTextColor="#999"
								secureTextEntry
								autoCapitalize="none"
							/>
						</View>

						{/* 変更ボタン */}
						<Pressable
							style={[styles.button, isLoading && styles.buttonDisabled]}
							onPress={handleChangeEmail}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>メールアドレスを変更</Text>
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
	input: {
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: "#343D45",
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
