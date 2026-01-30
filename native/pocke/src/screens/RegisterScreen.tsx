import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/types";
import { saveToken } from "../utils/tokenManager";
import Logo from "../components/Logo";
import GoogleLogo from "../components/GoogleLogo";

WebBrowser.maybeCompleteAuthSession();

type Props = {
	navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleRegister = async () => {
		// パスワード確認のバリデーション
		if (password !== confirmPassword) {
			Alert.alert("エラー", "パスワードが一致しません");
			return;
		}

		if (!email || !password) {
			Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
			return;
		}

		try {
			const url = "https://pocke-autumn-back.pocke-cojt.workers.dev/auth/signup";
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({"email":email,"password":password})
			});

			if (!response.ok) {
				console.error("新規登録失敗:", response.status);
				const errorText = await response.text();
				console.error("Response:", errorText);
				Alert.alert("エラー", "新規登録に失敗しました");
				return;
			}

			const data = await response.json();
			console.log(data);

			// tokenを保存
			if (data.token) {
				await saveToken(data.token);
				console.log("Token saved successfully");
				// 新規登録後はプロフィール設定画面へ
				navigation.navigate("Profile", { screen: "SettingProfile" });
			} else {
				console.error("Token not found in response");
				Alert.alert("エラー", "認証情報の保存に失敗しました");
			}
		} catch (error) {
			console.error("エラー:", error);
			Alert.alert("エラー", "通信エラーが発生しました");
		}
	};

	const handleGoogleRegister = async () => {
		try {
			const authUrl = "https://pocke-autumn-back.pocke-cojt.workers.dev/auth/google";
			
			// WebブラウザでGoogle認証ページを開く
			const result = await WebBrowser.openAuthSessionAsync(
				authUrl,
				"pocke://auth" // リダイレクトURL
			);

			console.log("Auth result:", result);

			if (result.type === "success" && result.url) {
				// URLからtokenを抽出
				const url = new URL(result.url);
				const token = url.searchParams.get("token");

				if (token) {
					await saveToken(token);
					console.log("Token saved successfully");
					// 新規登録後はプロフィール設定画面へ
					navigation.navigate("Profile", { screen: "SettingProfile" });
				} else {
					console.error("Token not found in redirect URL");
					Alert.alert("エラー", "認証に失敗しました");
				}
			} else if (result.type === "cancel") {
				console.log("ユーザーが認証をキャンセルしました");
			} else {
				console.error("認証失敗:", result);
				Alert.alert("エラー", "Google認証に失敗しました");
			}
		} catch (error) {
			console.error("エラー:", error);
			Alert.alert("エラー", "通信エラーが発生しました");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Logo width={150} height={52} />
			</View>

			<View style={styles.form}>
				<Text style={styles.title}>新規登録</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>メールアドレス</Text>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={setEmail}
						placeholder="email@example.com"
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>パスワード</Text>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						placeholder="パスワードを入力"
						secureTextEntry
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>パスワード（確認）</Text>
					<TextInput
						style={styles.input}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholder="パスワードを再入力"
						secureTextEntry
					/>
				</View>

				<Pressable style={styles.registerButton} onPress={handleRegister}>
					<Text style={styles.registerButtonText}>新規登録</Text>
				</Pressable>

			<Pressable 
				style={({ pressed }) => [
					styles.googleButton,
					pressed && styles.googleButtonPressed
				]}
				onPress={handleGoogleRegister}
			>
				<View style={styles.googleButtonStateOverlay} />
				<View style={styles.googleButtonContentWrapper}>
					<View style={styles.googleIconContainer}>
						<GoogleLogo width={20} height={20} />
					</View>
					<Text style={styles.googleButtonContents}>Googleで登録</Text>
				</View>
			</Pressable>

			<Pressable onPress={() => navigation.navigate("Login")}>
				<Text style={styles.loginLink}>
					既にアカウントをお持ちの方はこちら
				</Text>
			</Pressable>
		</View>
	</View>
);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	content: {
		alignItems: "center",
		paddingTop: 100,
		paddingBottom: 40,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		color: "#343D45",
	},
	form: {
		marginHorizontal: 24,
		paddingHorizontal: 24,
		paddingVertical: 32,
		gap: 24,
		backgroundColor: "#fff",
		borderRadius: 16,
	},
	inputContainer: {
		gap: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#343D45",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		backgroundColor: "#fff",
		color: "#343D45",
	},
	registerButton: {
		backgroundColor: "#F2ABAF",
		paddingVertical: 16,
		borderRadius: 24,
		alignItems: "center",
		marginTop: 8,
	},
	registerButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	googleButton: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#747775",
		borderRadius: 20,
		height: 40,
		paddingHorizontal: 12,
		marginTop: 8,
		position: "relative",
		overflow: "hidden",
		// iOS shadow
		shadowColor: "rgba(60, 64, 67, 0.3)",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 1,
		shadowRadius: 2,
		// Android shadow
		elevation: 2,
	},
	googleButtonPressed: {
		backgroundColor: "#F8F8F8",
		// iOS shadow - pressed state
		shadowColor: "rgba(60, 64, 67, 0.3)",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 1,
		shadowRadius: 3,
		// Android shadow - pressed state
		elevation: 3,
	},
	googleButtonStateOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
	},
	googleButtonContentWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		position: "relative",
	},
	googleIconContainer: {
		width: 20,
		height: 20,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	googleIconText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#4285F4",
		fontFamily: "System",
	},
	googleButtonContents: {
		color: "#1f1f1f",
		fontSize: 14,
		fontWeight: "500",
		fontFamily: "System",
		letterSpacing: 0.25,
	},
	loginLink: {
		textAlign: "center",
		color: "#F2ABAF",
		fontSize: 14,
		marginTop: 16,
	},
});