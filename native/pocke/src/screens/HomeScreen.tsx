import type {
	NativeScrollEvent,
	NativeSyntheticEvent,
} from "react-native";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	Dimensions,
	Image,
	ActivityIndicator,
} from "react-native";
import { getToken, clearToken } from "../utils/tokenManager";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { MainTabParamList, HomeStackParamList } from "../navigation/types";
import Logo from "../components/Logo";
import ToggleSwitch from "../components/ToggleSwitch";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

interface Community {
	id: string;
	name: string;
	description: string;
	iconUrl: string;
	createdAt: string;
	updatedAt: string;
	authority: string;
	joinedAt: string;
}

export default function HomeScreen() {
	const navigation = useNavigation<HomeScreenNavigationProp>();
	const tabNavigation = useNavigation<TabNavigationProp>();
	const [currentSlide, setCurrentSlide] = useState(0);
	const [toggleValue, setToggleValue] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);

	const [communities, setCommunities] = useState<Community[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useFocusEffect(
		useCallback(() => {
			// 画面にフォーカスが当たった時にトグルをリセット
			setToggleValue(false);
			fetchCommunities();
		}, [])
	);

	const fetchCommunities = async () => {
		setIsLoading(true);
		try {
			// AsyncStorageからtokenを取得
			const token = await getToken();

			if (!token) {
				console.error("Token not found. Please login first.");
				setIsLoading(false);
				return;
			}

			// まず/me APIでユーザーIDを取得
			const meResponse = await fetch(
				"https://pocke-autumn-back.pocke-cojt.workers.dev/me",
				{
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json"
					}
				}
			);

			if (meResponse.status === 401) {
				console.error("Token is invalid or expired (401), logging out");
				await clearToken();
				let rootNavigation = navigation.getParent();
				while (rootNavigation?.getParent()) {
					rootNavigation = rootNavigation.getParent();
				}
				if (rootNavigation) {
					rootNavigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [{ name: 'Welcome' }],
						})
					);
				}
				setIsLoading(false);
				return;
			}

			if (!meResponse.ok) {
				console.error(`/me API Error: ${meResponse.status} ${meResponse.statusText}`);
				const text = await meResponse.text();
				console.error("Response:", text);
				setIsLoading(false);
				return;
			}

			const userData = await meResponse.json();
			console.log("User data:", userData);
			const userId = userData.user.id;

			if (!userId) {
				console.error("User ID not found in /me response");
				setIsLoading(false);
				return;
			}

			// 取得したuser IDでコミュニティ一覧を取得
			const url = `https://pocke-autumn-back.pocke-cojt.workers.dev/community/user/${userId}`;
			const response = await fetch(url, {
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				}
			});

			if (response.status === 401) {
				console.error("Token is invalid or expired (401), logging out");
				await clearToken();
				let rootNavigation = navigation.getParent();
				while (rootNavigation?.getParent()) {
					rootNavigation = rootNavigation.getParent();
				}
				if (rootNavigation) {
					rootNavigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [{ name: 'Welcome' }],
						})
					);
				}
				setIsLoading(false);
				return;
			}

			if (!response.ok) {
				console.error(`API Error: ${response.status} ${response.statusText}`);
				const text = await response.text();
				console.error("Response:", text);
				setIsLoading(false);
				return;
			}

			const data = await response.json();
			// console.log("Communities API Response:", data);

			// APIレスポンスが配列の場合とオブジェクトの場合の両方に対応
			if (Array.isArray(data)) {
				setCommunities(data);
			} else if (data && Array.isArray(data.communities)) {
				setCommunities(data.communities);
			} else {
				console.error("Unexpected API response structure:", data);
				setCommunities([]);
			}
		} catch (error) {
			console.error("Error fetching communities:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// APIから取得したコミュニティデータを新着順にソートして最新3件を取得
	const newArrivals = communities
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 3)
		.map(community => ({
			id: community.id,
			name: community.name,
			description: community.description || "説明なし",
			iconUrl: community.iconUrl,
			createdAt: community.createdAt,
		}));

	// const newArrivals = [
	// 	{
	// 		id: "1",
	// 		category: "局員が好きな漫画一覧",
	// 		title: "僕のヒーローアカデミア",
	// 		author: "hui",
	// 	},
	// 	{
	// 		id: "2",
	// 		category: "おすすめの映画",
	// 		title: "タイトル2",
	// 		author: "user2",
	// 	},
	// 	{
	// 		id: "3",
	// 		category: "お気に入りの本",
	// 		title: "タイトル3",
	// 		author: "user3",
	// 	},
	// ];

	// const communities = [
	// 	{ id: "1", name: "jsys24" },
	// 	{ id: "2", name: "コミュニティの名前" },
	// 	{ id: "3", name: "jsys24" },
	// 	{ id: "4", name: "コミュニティの名前" },
	// ];

	const handleScroll = (
		event: NativeSyntheticEvent<NativeScrollEvent>
	) => {
		const SLIDE_WIDTH = width - 48 + 16;
		const offset = event.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(offset / SLIDE_WIDTH);
		setCurrentSlide(currentIndex);
	};

	if (isLoading) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Logo width={120} height={42} />
					<Pressable style={styles.notificationButton}>
						<Ionicons name="notifications-outline" size={28} color="#343D45" />
						<View style={styles.badge} />
					</Pressable>
				</View>
				<View style={[styles.content, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
					<ActivityIndicator size="large" color="#F2ABAF" />
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Logo width={120} height={42} />
				<Pressable style={styles.notificationButton}>
					<Ionicons name="notifications-outline" size={28} color="#343D45" />
					<View style={styles.badge} />
				</Pressable>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* NEW ARRIVAL Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="send" size={24} color="#343D45" />
						<Text style={styles.sectionTitle}>NEW ARRIVAL</Text>
					</View>

					<View style={styles.carouselContainer}>
						<Pressable
							style={[styles.arrowButton, styles.leftArrow]}
							onPress={() => {
								if (currentSlide > 0) {
									const SLIDE_WIDTH = width - 48 + 16;
									scrollViewRef.current?.scrollTo({
										x: (currentSlide - 1) * SLIDE_WIDTH,
										animated: true,
									});
								}
							}}
						>
							<Ionicons name="chevron-back" size={24} color="#343D45" />
						</Pressable>

						<ScrollView
							ref={scrollViewRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							onScroll={handleScroll}
							scrollEventThrottle={16}
							snapToInterval={width - 48 + 16}
							decelerationRate="fast"						contentContainerStyle={{ paddingRight: 48 }}							style={styles.carousel}
						>
						{newArrivals.map((item) => (
							<Pressable
								key={item.id}
								style={styles.carouselItem}
								onPress={() => navigation.navigate("CommunityDetail", { id: item.id })}
							>
								<View style={styles.carouselCard}>
									{item.iconUrl ? (
										<Image 
											source={{ uri: item.iconUrl }} 
											style={styles.carouselImage}
										/>
									) : (
										<View style={styles.carouselImagePlaceholder}>
											<Ionicons name="image-outline" size={40} color="#7A848C" />
										</View>
									)}
									<View style={styles.carouselContent}>
										<Text style={styles.carouselCategory}>
											コミュニティ
										</Text>
										<Text style={styles.carouselTitle}>{item.name}</Text>
										<Text style={styles.carouselDescription} numberOfLines={2}>
											{item.description}
										</Text>
									</View>
								</View>
							</Pressable>
						))}
						</ScrollView>

						<Pressable
							style={[styles.arrowButton, styles.rightArrow]}
							onPress={() => {
								if (currentSlide < newArrivals.length - 1) {
									const SLIDE_WIDTH = width - 48 + 16;
									scrollViewRef.current?.scrollTo({
										x: (currentSlide + 1) * SLIDE_WIDTH,
										animated: true,
									});
								}
							}}
						>
							<Ionicons name="chevron-forward" size={24} color="#343D45" />
						</Pressable>
					</View>

					<View style={styles.pagination}>
						{newArrivals.map((item) => (
							<View
								key={item.id}
								style={[
									styles.paginationDot,
									currentSlide === newArrivals.indexOf(item) && styles.paginationDotActive,
								]}
							/>
						))}
					</View>
				</View>

				{/* COMMUNITY Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<Path
								d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
								stroke="#343D45"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<Path
								d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
								stroke="#343D45"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<Path
								d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
								stroke="#343D45"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<Path
								d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
								stroke="#343D45"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Svg>
						<Text style={styles.sectionTitle}>COMMUNITY</Text>
					</View>

					<View style={styles.communityGrid}>
						{communities.map((community: Community) => (
						<Pressable
							key={community.id}
							style={styles.communityCard}
							onPress={() => navigation.navigate("CommunityDetail", { id: community.id })}
						>
							<View style={styles.communityImagePlaceholder} />
							<Text style={styles.communityName}>{community.name}</Text>
						</Pressable>
					))}
				</View>

				<View style={styles.actionButtons}>
					<Pressable
						style={styles.actionButton}
						onPress={() => navigation.navigate("JoinCommunity")}
					>
					<Text style={styles.actionButtonText}>コミュニティへ参加</Text>
					</Pressable>
					<Pressable
						style={styles.actionButton}
						onPress={() => navigation.navigate("CreateCommunity")}
					>
						<Text style={styles.actionButtonText}>コミュニティの作成</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>

		{/* Floating Toggle Switch */}
		<View style={styles.floatingToggle}>
			<ToggleSwitch
				value={toggleValue}
				onValueChange={(newValue) => {
					if (newValue) {
						tabNavigation.navigate("Profile", {
							screen: "ProfileHome",
						});
						// ナビゲーション後、トグルは useFocusEffect でリセットされる
					} else {
						setToggleValue(false);
					}
				}}
			/>
		</View>
	</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 24,
		paddingTop: 50,
		paddingBottom: 16,
		backgroundColor: "#fff",
	},
	notificationButton: {
		position: "relative",
	},
	badge: {
		position: "absolute",
		top: 2,
		right: 2,
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#F2ABAF",
		borderWidth: 2,
		borderColor: "#fff",
	},
	content: {
		flex: 1,
	},
	section: {
		marginTop: 24,
		paddingHorizontal: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		gap: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#343D45",
		letterSpacing: 0.5,
	},
	carouselContainer: {
		position: "relative",
		marginHorizontal: -24,
	},
	carousel: {
		paddingHorizontal: 24,
	},
	carouselContentContainer: {
		paddingRight: 8,
	},
	carouselItem: {
		width: width - 48,
		marginRight: 16,
	},
	carouselCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	carouselImagePlaceholder: {
		width: "100%",
		height: 180,
		backgroundColor: "#E8E8E8",
		justifyContent: "center",
		alignItems: "center",
	},
	carouselImage: {
		width: "100%",
		height: 180,
		resizeMode: "cover",
	},
	carouselContent: {
		padding: 16,
	},
	carouselCategory: {
		fontSize: 12,
		color: "#999",
		marginBottom: 4,
	},
	carouselTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#343D45",
		marginBottom: 8,
	},
	carouselDescription: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	// authorContainer: {
	// 	flexDirection: "row",
	// 	alignItems: "center",
	// 	gap: 8,
	// },
	// authorAvatar: {
	// 	width: 32,
	// 	height: 32,
	// 	borderRadius: 16,
	// 	backgroundColor: "#C0C0C0",
	// },
	// authorName: {
	// 	fontSize: 14,
	// 	color: "#666",
	// },
	arrowButton: {
		position: "absolute",
		top: "50%",
		transform: [{ translateY: -20 }],
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	leftArrow: {
		left: 32,
	},
	rightArrow: {
		right: 32,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
		gap: 8,
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#D0D0D0",
	},
	paginationDotActive: {
		width: 24,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#343D45",
	},
	communityGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
		marginBottom: 24,
	},
	communityCard: {
		width: (width - 72) / 2,
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 2,
	},
	communityImagePlaceholder: {
		width: "100%",
		height: 120,
		backgroundColor: "#E8E8E8",
	},
	communityName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#343D45",
		padding: 12,
	},
	actionButtons: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 32,
	},
	actionButton: {
		flex: 1,
		backgroundColor: "#343D45",
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	actionButtonText: {
		color: "#fff",
		fontSize: 13,
		fontWeight: "600",
	},
	floatingToggle: {
		position: "absolute",
		bottom: 24,
		right: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
});
