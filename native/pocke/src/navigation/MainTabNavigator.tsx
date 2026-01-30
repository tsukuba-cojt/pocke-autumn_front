import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileStackNavigator from "./ProfileStackNavigator";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "#F2ABAF",
				tabBarInactiveTintColor: "#999",
				tabBarStyle: {
					display: "none",
				},
				headerShown: false,
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeStackNavigator}
				options={{
					title: "ホーム",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Notifications"
				component={NotificationsScreen}
				options={{
					title: "通知",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="notifications" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileStackNavigator}
				options={{
					title: "プロフィール",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" size={size} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}