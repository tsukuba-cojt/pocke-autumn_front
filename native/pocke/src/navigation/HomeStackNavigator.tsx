import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CreateCommunityScreen from "../screens/CreateCommunityScreen";
import type { MainTabParamList } from "./types";

const Stack = createNativeStackNavigator<MainTabParamList>();

export default function HomeStackNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen
				name="CreateCommunity"
				component={CreateCommunityScreen}
			/>
		</Stack.Navigator>
	);
}
