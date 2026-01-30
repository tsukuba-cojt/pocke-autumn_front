import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { HomeStackParamList } from "../navigation/types";
import { getToken } from "../utils/tokenManager";

type Props = {
	navigation: NativeStackNavigationProp<HomeStackParamList, "CommunityMembers">;
	route: RouteProp<HomeStackParamList, "CommunityMembers">;
};

interface Member {
	id: string;
	username: string;
	displayName?: string;
	iconUrl?: string;
	authority: string;
}

export default function CommunityMembersScreen({ navigation, route }: Props) {
	const { id } = route.params;
	const [members, setMembers] = useState<Member[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchMembers();
	}, [id]);

	const fetchMembers = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				console.error("No token found");
				return;
			}

			const response = await fetch(
				`https://pocke-autumn-back.pocke-cojt.workers.dev/community/${id}/members`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log("Members data:", data);
				setMembers(data.members || []);
			} else {
				console.error("Failed to fetch members:", response.status);
			}
		} catch (error) {
			console.error("Error fetching members:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
					<Ionicons name="close" size={28} color="#343D45" />
				</Pressable>
				<Text style={styles.headerTitle}>コミュニティメンバー</Text>
			</View>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#F2ABAF" />
				</View>
			) : (
				<ScrollView style={styles.content}>
					{members.map((member) => (
						<Pressable 
							key={member.id} 
							style={styles.memberItem}
							onPress={() => navigation.navigate("UserProfile", { userId: member.id })}
						>
							<View style={styles.memberAvatar} />
							<View style={styles.memberInfo}>
								<Text style={styles.memberName}>
									{member.displayName || member.username}
								</Text>
								{member.authority === "admin" && (
									<Text style={styles.memberRole}>管理者</Text>
								)}
							</View>
							<Ionicons name="chevron-forward" size={24} color="#999" />
						</Pressable>
					))}
				</ScrollView>
			)}
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
		paddingTop: 60,
		paddingHorizontal: 24,
		paddingBottom: 16,
		backgroundColor: "#fff",
	},
	closeButton: {
		position: "absolute",
		left: 16,
		top: 56,
		zIndex: 10,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#343D45",
		textAlign: "center",
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
		backgroundColor: "#fff",
	},
	memberItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	memberAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#9E9E9E",
		marginRight: 16,
	},
	memberInfo: {
		flex: 1,
	},
	memberName: {
		fontSize: 16,
		color: "#343D45",
	},
	memberRole: {
		fontSize: 14,
		color: "#F2ABAF",
		marginTop: 2,
	},
});
