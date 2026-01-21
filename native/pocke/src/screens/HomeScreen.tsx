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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../navigation/types";
import Logo from "../components/Logo";
import ToggleSwitch from "../components/ToggleSwitch";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

type HomeScreenNavigationProp = NativeStackNavigationProp<MainTabParamList>;
type TabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export default function HomeScreen() {
	const navigation = useNavigation<HomeScreenNavigationProp>();
	const tabNavigation = useNavigation<TabNavigationProp>();
	const [currentSlide, setCurrentSlide] = useState(0);
	const [toggleValue, setToggleValue] = useState(true);
	const scrollViewRef = useRef<ScrollView>(null);

	const newArrivals = [
		{
			id: "1",
			category: "局員が好きな漫画一覧",
			title: "僕のヒーローアカデミア",
			author: "hui",
		},
		{
			id: "2",
			category: "おすすめの映画",
			title: "タイトル2",
			author: "user2",
		},
		{
			id: "3",
			category: "お気に入りの本",
			title: "タイトル3",
			author: "user3",
		},
	];

	const communities = [
		{ id: "1", name: "jsys24" },
		{ id: "2", name: "コミュニティの名前" },
		{ id: "3", name: "jsys24" },
		{ id: "4", name: "コミュニティの名前" },
	];

	const handleScroll = (
		event: NativeSyntheticEvent<NativeScrollEvent>
	) => {
		const slideSize = width - 48;
		const offset = event.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(offset / slideSize);
		setCurrentSlide(currentIndex);
	};

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
									scrollViewRef.current?.scrollTo({
										x: (currentSlide - 1) * (width - 48),
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
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							onScroll={handleScroll}
							scrollEventThrottle={16}
							style={styles.carousel}
						>
							{newArrivals.map((item) => (
								<View key={item.id} style={styles.carouselItem}>
									<View style={styles.carouselCard}>
										<View style={styles.carouselImagePlaceholder} />
										<View style={styles.carouselContent}>
											<Text style={styles.carouselCategory}>
												{item.category}
											</Text>
											<Text style={styles.carouselTitle}>{item.title}</Text>
											<View style={styles.authorContainer}>
												<View style={styles.authorAvatar} />
												<Text style={styles.authorName}>{item.author}</Text>
											</View>
										</View>
									</View>
								</View>
							))}
						</ScrollView>

						<Pressable
							style={[styles.arrowButton, styles.rightArrow]}
							onPress={() => {
								if (currentSlide < newArrivals.length - 1) {
									scrollViewRef.current?.scrollTo({
										x: (currentSlide + 1) * (width - 48),
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
						{communities.map((community) => (
							<Pressable key={community.id} style={styles.communityCard}>
								<View style={styles.communityImagePlaceholder} />
								<Text style={styles.communityName}>{community.name}</Text>
							</Pressable>
						))}
					</View>

				<View style={styles.actionButtons}>
					<Pressable style={styles.actionButton}>
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

			{/* Floating Toggle */}
		<Pressable
			style={styles.floatingToggle}
			onPress={() => {
				if (!toggleValue) {
					tabNavigation.navigate("Profile");
				}
			}}
		>
			<ToggleSwitch value={toggleValue} onValueChange={setToggleValue} />
		</Pressable>
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
	carouselItem: {
		width: width - 48,
		paddingHorizontal: 8,
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
		marginBottom: 12,
	},
	authorContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	authorAvatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#C0C0C0",
	},
	authorName: {
		fontSize: 14,
		color: "#666",
	},
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
