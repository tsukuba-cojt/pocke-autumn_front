import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	Dimensions,
	Modal,
	Image,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";
import { CameraView, useCameraPermissions } from "expo-camera";

type JoinCommunityScreenNavigationProp = NativeStackNavigationProp<
	HomeStackParamList,
	"JoinCommunity"
>;

type Props = {
	navigation: JoinCommunityScreenNavigationProp;
	route: RouteProp<HomeStackParamList, "JoinCommunity">;
};

const { width } = Dimensions.get("window");

export default function JoinCommunityScreen({ navigation, route }: Props) {
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [communityId, setCommunityId] = useState("");
	const [communityInfo, setCommunityInfo] = useState<{
		name: string;
		iconUrl?: string;
	} | null>(null);
	const [isLoadingInfo, setIsLoadingInfo] = useState(false);

	// ディープリンクからcommunityIdを取得した場合の処理
	useEffect(() => {
		const deepLinkCommunityId = route.params?.communityId;
		if (deepLinkCommunityId) {
			setCommunityId(deepLinkCommunityId);
			// ディープリンクから来た場合は自動的にAPIを叩く
			const joinCommunityAuto = async (id: string) => {
				const token = await getToken();

				try {
					const response = await fetch(`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}/members`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
						body: JSON.stringify({
							authority: "member",
						}),
					});

					console.log("Auto join response status:", response.status);

					if (response.ok || response.status === 409) {
						// 成功または既に参加済み - 直接遷移
						navigation.replace("CommunityDetail", { id: id });
					} else {
						const errorText = await response.text();
						console.error("コミュニティ参加失敗:", response.status, errorText);
						Alert.alert("エラー", "コミュニティへの参加に失敗しました");
					}
				} catch (error) {
					console.error("コミュニティ参加エラー:", error);
					Alert.alert("エラー", "コミュニティへの参加中にエラーが発生しました");
				}
			};
			joinCommunityAuto(deepLinkCommunityId);
		}
	}, [route.params?.communityId, navigation]);

	useEffect(() => {
		if (!permission) {
			requestPermission();
		}
	}, [permission, requestPermission]);

	const handleGoBack = () => {
		navigation.goBack();
	};

	const handleBarCodeScanned = async ({ data }: { data: string }) => {
		if (scanned) return;
		setScanned(true);

		// URLからcommunityIdを抽出
		let extractedId = data;
		try {
			const url = new URL(data);
			const pathParts = url.pathname.split('/');
			const joinIndex = pathParts.indexOf('join');
			if (joinIndex > 0) {
				extractedId = pathParts[joinIndex - 1];
			}
		} catch {
			// URLではない場合はそのまま使用
			extractedId = data;
		}

		setCommunityId(extractedId);

		// コミュニティ情報を取得してモーダルを表示
		setIsLoadingInfo(true);
		const token = await getToken();

		try {
			const response = await fetch(`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${extractedId}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setCommunityInfo({
					name: data.name,
					iconUrl: data.iconUrl,
				});
				setModalVisible(true);
			} else {
				console.error("コミュニティ情報取得失敗:", response.status);
				Alert.alert(
					"エラー",
					"コミュニティ情報の取得に失敗しました",
					[
						{
							text: "OK",
							onPress: () => setScanned(false),
						},
					]
				);
			}
		} catch (error) {
			console.error("コミュニティ情報取得エラー:", error);
			Alert.alert(
				"エラー",
				"コミュニティ情報の取得中にエラーが発生しました",
				[
					{
						text: "OK",
						onPress: () => setScanned(false),
					},
				]
			);
		} finally {
			setIsLoadingInfo(false);
		}
	};

	const handleJoinCommunity = async () => {
		setModalVisible(false);
		const token = await getToken();

		try {
			console.log("Joining community:", communityId);
			const response = await fetch(`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${communityId}/members`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({
					authority: "member",
				}),
			});

			console.log("Join response status:", response.status);

			if (response.ok || response.status === 409) {
				// 成功または既に参加済み - 直接遷移
				console.log("Navigating to CommunityDetail with id:", communityId);
				navigation.replace("CommunityDetail", { id: communityId });
			} else {
				const errorText = await response.text();
				console.error("コミュニティ参加失敗:", response.status, errorText);
				Alert.alert(
					"エラー",
					"コミュニティへの参加に失敗しました",
					[
						{
							text: "OK",
							onPress: () => setScanned(false),
						},
					]
				);
			}
		} catch (error) {
			console.error("コミュニティ参加エラー:", error);
			Alert.alert(
				"エラー",
				"コミュニティへの参加中にエラーが発生しました",
				[
					{
						text: "OK",
						onPress: () => setScanned(false),
					},
				]
				);
		}
	};

	const handleCancel = () => {
		setModalVisible(false);
		setScanned(false);
		setCommunityId("");
	};

	// 画像からQRコードを読み取る関数（バックエンドAPI経由）
	// const decodeQRFromImage = async (imageUri: string): Promise<string | null> => {
	// 	try {
	// 		const token = await getToken();
	// 		
	// 		// 画像をBase64に変換
	// 		const base64 = await FileSystem.readAsStringAsync(imageUri, {
	// 			encoding: FileSystem.EncodingType.Base64,
	// 		});

	// 		// バックエンドにQRコードデコードをリクエスト
	// 		const response = await fetch("https://pocke-autumn-back.pocke-cojt.workers.dev/qr/decode", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				"Authorization": `Bearer ${token}`,
	// 			},
	// 			body: JSON.stringify({
	// 				image: base64,
	// 			}),
	// 		});

	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			return data.qrData || data.data || null;
	// 		} else {
	// 			console.error("QRコード読み取り失敗:", response.status);
	// 			return null;
	// 		}
	// 	} catch (error) {
	// 		console.error("QRコード読み取りエラー:", error);
	// 		return null;
	// 	}
	// };

	// const handlePickImage = async () => {
	// 	const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
	// 	if (status !== "granted") {
	// 		Alert.alert(
	// 			"権限が必要です",
	// 			"画像を選択するには、カメラロールへのアクセス権限が必要です。",
	// 		);
	// 		return;
	// 	}

	// 	const result = await ImagePicker.launchImageLibraryAsync({
	// 		mediaTypes: ['images'],
	// 		allowsEditing: false,
	// 		quality: 1,
	// 	});

	// 	if (!result.canceled && result.assets && result.assets.length > 0) {
	// 		const imageUri = result.assets[0].uri;
	// 		
	// 		// QRコードを読み取る
	// 		setIsLoadingInfo(true);
	// 		const qrData = await decodeQRFromImage(imageUri);
	// 		
	// 		if (!qrData) {
	// 			Alert.alert("エラー", "QRコードを検出できませんでした。別の画像を試してください。");
	// 			setIsLoadingInfo(false);
	// 			return;
	// 		}

	// 		// URLからcommunityIdを抽出
	// 		let extractedId = qrData;
	// 		try {
	// 			const url = new URL(qrData);
	// 			const pathParts = url.pathname.split('/');
	// 			const joinIndex = pathParts.indexOf('join');
	// 			if (joinIndex > 0) {
	// 				extractedId = pathParts[joinIndex - 1];
	// 			}
	// 		} catch {
	// 			// URLではない場合はそのまま使用
	// 			extractedId = qrData;
	// 		}
	// 		
	// 		setCommunityId(extractedId);

	// 		// コミュニティ情報を取得
	// 		const token = await getToken();

	// 		try {
	// 			const response = await fetch(`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${extractedId}`, {
	// 				method: "GET",
	// 				headers: {
	// 					"Authorization": `Bearer ${token}`,
	// 				},
	// 			});

	// 			if (response.ok) {
	// 				const data = await response.json();
	// 				setCommunityInfo({
	// 					name: data.name || extractedId,
	// 					iconUrl: data.iconUrl,
	// 				});
	// 				setModalVisible(true);
	// 			} else {
	// 				console.error("コミュニティ情報取得失敗:", response.status);
	// 				Alert.alert("エラー", "コミュニティ情報の取得に失敗しました");
	// 			}
	// 		} catch (error) {
	// 			console.error("コミュニティ情報取得エラー:", error);
	// 			Alert.alert("エラー", "コミュニティ情報の取得中にエラーが発生しました");
	// 		} finally {
	// 			setIsLoadingInfo(false);
	// 		}
	// 	}
	// };

	if (!permission) {
		return (
			<View style={styles.container}>
				<Text>カメラ権限を確認中...</Text>
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
						<Ionicons name="chevron-back" size={28} color="#333" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>コミュニティへ参加</Text>
					<View style={styles.placeholder} />
				</View>
				<View style={styles.permissionContainer}>
					<Text style={styles.permissionText}>
						カメラへのアクセス権限が必要です
					</Text>
					<TouchableOpacity
						style={styles.permissionButton}
						onPress={requestPermission}
					>
						<Text style={styles.permissionButtonText}>権限を許可</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
					<Ionicons name="chevron-back" size={28} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>コミュニティへ参加</Text>
				<View style={styles.placeholder} />
			</View>

			{/* Content */}
			<View style={styles.content}>
				<Text style={styles.instructionText}>QRコードをスキャン</Text>

				{/* QR Code Scanner Area */}
				<View style={styles.scannerContainer}>
					<CameraView
						style={styles.camera}
						facing="back"
						onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
						barcodeScannerSettings={{
							barcodeTypes: ["qr"],
						}}
					/>
				</View>

				{/* Use Image Button */}
				{/* <TouchableOpacity
					style={styles.imageButton}
					onPress={handlePickImage}
				>
					<Text style={styles.imageButtonText}>画像を使用する</Text>
				</TouchableOpacity> */}
			</View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={handleCancel}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						{isLoadingInfo ? (
							<ActivityIndicator size="large" color="#F2ABAF" />
						) : (
							<>
								<View style={styles.modalImageContainer}>
									{communityInfo?.iconUrl ? (
										<Image
											source={{ uri: communityInfo.iconUrl }}
											style={styles.modalImage}
											resizeMode="cover"
										/>
									) : (
										<View style={styles.modalImagePlaceholder} />
									)}
								</View>

								<Text style={styles.modalCommunityName}>
									{communityInfo?.name}
								</Text>

								<View style={styles.modalButtonContainer}>
									<TouchableOpacity
										style={styles.modalJoinButton}
										onPress={handleJoinCommunity}
									>
										<Text style={styles.modalJoinButtonText}>参加する</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.modalCancelButton}
										onPress={handleCancel}
									>
										<Text style={styles.modalCancelButtonText}>キャンセル</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
					</View>
				</View>
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
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingTop: 60,
		paddingBottom: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	placeholder: {
		width: 36,
	},
	content: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 40,
	},
	instructionText: {
		fontSize: 16,
		color: "#666",
		marginBottom: 30,
	},
	scannerContainer: {
		width: width - 40,
		aspectRatio: 1,
		marginBottom: 40,
		overflow: "hidden",
		borderRadius: 12,
	},
	camera: {
		flex: 1,
	},
	scannerPlaceholder: {
		flex: 1,
		backgroundColor: "#D9D9D9",
		borderRadius: 12,
	},
	permissionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	permissionText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
	},
	permissionButton: {
		backgroundColor: "#F2ABAF",
		paddingHorizontal: 30,
		paddingVertical: 12,
		borderRadius: 25,
	},
	permissionButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	imageButton: {
		backgroundColor: "#F2ABAF",
		paddingHorizontal: 40,
		paddingVertical: 14,
		borderRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	imageButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		width: width - 60,
		alignItems: "center",
	},
	modalImageContainer: {
		width: "100%",
		aspectRatio: 16 / 9,
		marginBottom: 20,
	},
	modalImage: {
		flex: 1,
		width: "100%",
		borderRadius: 8,
	},
	modalImagePlaceholder: {
		flex: 1,
		backgroundColor: "#D9D9D9",
		borderRadius: 8,
	},
	modalCommunityName: {
		fontSize: 20,
		fontWeight: "600",
		color: "#333",
		marginBottom: 30,
		textAlign: "center",
	},
	modalButtonContainer: {
		flexDirection: "row",
		gap: 16,
		width: "100%",
	},
	modalJoinButton: {
		flex: 1,
		paddingVertical: 14,
		alignItems: "center",
	},
	modalJoinButtonText: {
		color: "#F2ABAF",
		fontSize: 16,
		fontWeight: "600",
	},
	modalCancelButton: {
		flex: 1,
		paddingVertical: 14,
		alignItems: "center",
	},
	modalCancelButtonText: {
		color: "#333",
		fontSize: 16,
		fontWeight: "600",
	},
});
