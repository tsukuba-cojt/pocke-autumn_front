import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "CommunitySettings">;
	route: RouteProp<HomeStackParamList, "CommunitySettings">;
};

const MAX_NAME_LENGTH = 50;

type Member = {
	id: string;
	name: string;
	role: "admin" | "member";
	avatar?: string;
};

export default function CommunitySettingsScreen({ navigation, route }: Props) {
	const { id: _ } = route.params;

	const [communityName, setCommunityName] = useState("");
	const [communityImage, setCommunityImage] = useState<string | null>(null);
	const [members] = useState<Member[]>([
		{ id: "1", name: "hui", role: "admin" },
		{ id: "2", name: "Utsugi", role: "admin" },
		{ id: "3", name: "user3", role: "member" },
		{ id: "4", name: "hui", role: "member" },
		{ id: "5", name: "Utsugi", role: "member" },
		{ id: "6", name: "user3", role: "member" },
	]);

	const handlePickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setCommunityImage(result.assets[0].uri);
		}
	};

	const handleSave = () => {
		// 保存処理
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons name="close" size={28} color="#fff" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>設定</Text>
				<TouchableOpacity onPress={handleSave} style={styles.saveButton}>
					<Text style={styles.saveButtonText}>保存</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Community Image */}
				<View style={styles.imageSection}>
					<TouchableOpacity
						style={styles.imageContainer}
						onPress={handlePickImage}
					>
						{communityImage ? (
							<Image source={{ uri: communityImage }} style={styles.image} />
						) : (
							<View style={styles.imagePlaceholder} />
						)}
					</TouchableOpacity>
					<TouchableOpacity onPress={handlePickImage}>
						<Text style={styles.changeImageText}>画像を変更する</Text>
					</TouchableOpacity>
				</View>

				{/* Community Name */}
				<View style={styles.formGroup}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>コミュニティ名</Text>
						<Text style={styles.charCount}>
							{communityName.length}/{MAX_NAME_LENGTH}
						</Text>
					</View>
					<TextInput
						style={styles.input}
						value={communityName}
						onChangeText={(text) => {
							if (text.length <= MAX_NAME_LENGTH) {
								setCommunityName(text);
							}
						}}
						placeholder=""
						maxLength={MAX_NAME_LENGTH}
					/>
				</View>

				{/* Members Section */}
				<View style={styles.membersSection}>
					<Text style={styles.sectionTitle}>メンバーの編集</Text>
					{members.map((member) => (
						<View key={member.id} style={styles.memberItem}>
							<View style={styles.memberLeft}>
								<View style={styles.avatar}>
									{member.avatar ? (
										<Image source={{ uri: member.avatar }} style={styles.avatarImage} />
									) : (
										<View style={styles.avatarPlaceholder} />
									)}
								</View>
								<Text style={styles.memberName}>{member.name}</Text>
							</View>
							<View
								style={[
									styles.roleBadge,
									member.role === "admin"
										? styles.adminBadge
										: styles.memberBadge,
								]}
							>
								<Text
									style={[
										styles.roleText,
										member.role === "admin"
											? styles.adminText
											: styles.memberText,
									]}
								>
									{member.role}
								</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#6B7A8C",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 50,
		paddingHorizontal: 20,
		paddingBottom: 16,
		backgroundColor: "#6B7A8C",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#fff",
		flex: 1,
		textAlign: "center",
	},
	saveButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1.5,
		borderColor: "#F2ABAF",
	},
	saveButtonText: {
		color: "#F2ABAF",
		fontSize: 14,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	imageSection: {
		alignItems: "center",
		paddingTop: 32,
		paddingBottom: 24,
		backgroundColor: "#fff",
	},
	imageContainer: {
		width: 160,
		height: 120,
		marginBottom: 16,
	},
	imagePlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#D9D9D9",
		borderRadius: 12,
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
	},
	changeImageText: {
		fontSize: 14,
		color: "#333",
	},
	formGroup: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		backgroundColor: "#fff",
		marginTop: 8,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	label: {
		fontSize: 14,
		color: "#333",
		fontWeight: "600",
	},
	charCount: {
		fontSize: 12,
		color: "#999",
	},
	input: {
		backgroundColor: "#F5F5F5",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		fontSize: 15,
		color: "#333",
	},
	membersSection: {
		backgroundColor: "#fff",
		marginTop: 8,
		paddingVertical: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		paddingHorizontal: 20,
		marginBottom: 16,
		textAlign: "center",
	},
	memberItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	memberLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	avatar: {
		width: 48,
		height: 48,
	},
	avatarPlaceholder: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#999",
	},
	avatarImage: {
		width: 48,
		height: 48,
		borderRadius: 24,
	},
	memberName: {
		fontSize: 15,
		color: "#333",
	},
	roleBadge: {
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 16,
	},
	adminBadge: {
		backgroundColor: "#FFE8E9",
	},
	memberBadge: {
		backgroundColor: "#E8E8E8",
	},
	roleText: {
		fontSize: 13,
		fontWeight: "500",
	},
	adminText: {
		color: "#F2ABAF",
	},
	memberText: {
		color: "#666",
	},
});
