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
import type { MainTabParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";
import ScreenHeader, { screenHeaderStyles } from "../components/ScreenHeader";

type Props = {
	navigation: NativeStackNavigationProp<MainTabParamList>;
};

export default function CreateCommunityScreen({ navigation }: Props) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [communityImage, setCommunityImage] = useState<string | null>(null);

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
		}
	};

	const handleCreate = () => {
		if (!name.trim()) {
			alert("コミュニティ名を入力してください");
			return;
		}

		// TODO: サーバーにコミュニティを作成
		console.log("Community created:", { name, description, image: communityImage });

		// フォームをリセット
		setName("");
		setDescription("");
		setCommunityImage(null);

		// HomeScreenに戻る
		navigation.goBack();
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
