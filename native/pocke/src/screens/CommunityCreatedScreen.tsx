import { View, Text, StyleSheet, Pressable, Alert, Clipboard, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import QRCode from "react-native-qrcode-svg";
import { useRef } from "react";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "CommunityCreated">;
	route: RouteProp<HomeStackParamList, "CommunityCreated">;
};

export default function CommunityCreatedScreen({ navigation, route }: Props) {
	const { communityId, communityName } = route.params;
	const viewShotRef = useRef<ViewShot>(null);
	
	// 他アプリでも認識されるHTTPSベースのURL
	const inviteUrl = `https://pocke-autumn-back.pocke-cojt.workers.dev/community/${communityId}/join`;
	
	const handleDownloadQR = async () => {
		try {
			if (!viewShotRef.current || !viewShotRef.current.capture) {
				Alert.alert("エラー", "QRコードの取得に失敗しました");
				return;
			}

			// QRコードをキャプチャ
			const uri = await viewShotRef.current.capture();
			console.log("QR Code captured:", uri);

			if (Platform.OS === "android" || Platform.OS === "ios") {
				// メディアライブラリの権限をリクエスト
				const { status } = await MediaLibrary.requestPermissionsAsync();
				
				if (status === "granted") {
					// カメラロールに保存
					await MediaLibrary.createAssetAsync(uri);
					Alert.alert("保存完了", "QRコードをギャラリーに保存しました");
				} else {
					// 権限がない場合は共有機能を使用
					const isAvailable = await Sharing.isAvailableAsync();
					if (isAvailable) {
						await Sharing.shareAsync(uri, {
							mimeType: "image/png",
							dialogTitle: "QRコードを保存",
						});
					} else {
						Alert.alert("エラー", "保存権限が必要です");
					}
				}
			} else {
				// Web環境の場合は共有機能を使用
				const isAvailable = await Sharing.isAvailableAsync();
				if (isAvailable) {
					await Sharing.shareAsync(uri);
				}
			}
		} catch (error) {
			console.error("QRコード保存エラー:", error);
			Alert.alert("エラー", "QRコードの保存に失敗しました");
		}
	};

	const handleCopyLink = () => {
		Clipboard.setString(inviteUrl);
		Alert.alert("コピー完了", "招待リンクをクリップボードにコピーしました");
	};

	return (
		<View style={styles.container}>
			{/* Back Button */}
			<Pressable 
				style={styles.backButton}
				onPress={() => navigation.goBack()}
			>
				<Ionicons name="chevron-back" size={28} color="#343D45" />
			</Pressable>

			{/* Content */}
			<View style={styles.content}>
				<Text style={styles.title}>コミュニティ作成完了！</Text>
				<Text style={styles.communityName}>{communityName}</Text>
				<Text style={styles.subtitle}>友達を招待しましょう</Text>

				{/* QR Code Area */}
				<ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
					<View style={styles.qrContainer}>
						<QRCode
							value={inviteUrl}
							size={250}
							backgroundColor="#ffffff"
							color="#343D45"
						/>
					</View>
				</ViewShot>

				{/* Action Buttons */}
				<View style={styles.actions}>
					<Pressable 
						style={styles.actionButton}
						onPress={handleDownloadQR}
					>
						<View style={styles.iconCircle}>
							<Ionicons name="arrow-down" size={32} color="#343D45" />
						</View>
						<Text style={styles.actionText}>QRコードをダウンロード</Text>
					</Pressable>

					<Pressable 
						style={styles.actionButton}
						onPress={handleCopyLink}
					>
						<View style={styles.iconCircle}>
							<Ionicons name="copy-outline" size={32} color="#343D45" />
						</View>
						<Text style={styles.actionText}>招待リンクをコピー</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	backButton: {
		position: "absolute",
		top: 50,
		left: 24,
		zIndex: 10,
		padding: 8,
	},
	content: {
		flex: 1,
		paddingTop: 100,
		paddingHorizontal: 24,
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#343D45",
		marginBottom: 8,
	},
	communityName: {
		fontSize: 20,
		fontWeight: "600",
		color: "#F2ABAF",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginBottom: 40,
	},
	qrContainer: {
		width: "100%",
		aspectRatio: 1,
		backgroundColor: "#fff",
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 40,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	qrText: {
		fontSize: 18,
		color: "#999",
		fontWeight: "500",
	},
	actions: {
		width: "100%",
		gap: 16,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	iconCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#F2ABAF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	actionText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#343D45",
	},
});
