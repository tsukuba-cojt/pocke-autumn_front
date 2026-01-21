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

type Props = {
	navigation: NativeStackNavigationProp<ProfileStackParamList>;
};

export default function SettingProfile({ navigation: _ }: Props) {
	const tabNavigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>();
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [bio, setBio] = useState("");
	const [profileImage, setProfileImage] = useState<string | null>(null);

	const handleUsernameChange = (value: string) => {
		setUsername(value.slice(0, 50));
	};

	const handleDisplayNameChange = (value: string) => {
		setDisplayName(value.slice(0, 50));
	};

	const handleBioChange = (value: string) => {
		setBio(value.slice(0, 200));
	};

	const handleSave = () => {
		// TODO: サーバーにプロフィール情報を保存
		// HomeScreen画面に遷移
		tabNavigation.navigate("Home");
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
