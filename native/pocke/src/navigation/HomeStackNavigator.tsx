import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CreateCommunityScreen from "../screens/CreateCommunityScreen";
import CommunityCreatedScreen from "../screens/CommunityCreatedScreen";
import CommunityDetailScreen from "../screens/CommunityDetailScreen";
import CommunitySettingsScreen from "../screens/CommunitySettingsScreen";
import CommunityMembersScreen from "../screens/CommunityMembersScreen";
import ListDetailScreen from "../screens/ListDetailScreen";
import JoinCommunityScreen from "../screens/JoinCommunityScreen";
import CreateListScreen from "../screens/CreateListScreen";
import AddItemScreen from "../screens/AddItemScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import type { HomeStackParamList } from "./types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="HomeMain"
				component={HomeScreen}
			/>
			<Stack.Screen
				name="JoinCommunity"
				component={JoinCommunityScreen}
			/>
			<Stack.Screen
				name="CreateCommunity"
				component={CreateCommunityScreen}
			/>
			<Stack.Screen
				name="CommunityCreated"
				component={CommunityCreatedScreen}
			/>
			<Stack.Screen
				name="CommunityDetail"
				component={CommunityDetailScreen}
			/>
			<Stack.Screen
				name="CommunitySettings"
				component={CommunitySettingsScreen}
			/>
			<Stack.Screen
				name="CommunityMembers"
				component={CommunityMembersScreen}
			/>
			<Stack.Screen
				name="ListDetail"
				component={ListDetailScreen}
			/>
			<Stack.Screen
				name="CreateList"
				component={CreateListScreen}
			/>
			<Stack.Screen
				name="AddItem"
				component={AddItemScreen}
			/>
			<Stack.Screen
				name="UserProfile"
				component={UserProfileScreen}
			/>
		</Stack.Navigator>
	);
}
