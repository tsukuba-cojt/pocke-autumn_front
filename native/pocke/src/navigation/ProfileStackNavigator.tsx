import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import SettingProfile from "../screens/SettingProfile";
import type { ProfileStackParamList } from "./types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="ProfileHome" component={ProfileScreen} />
			<Stack.Screen name="SettingProfile" component={SettingProfile} />
		</Stack.Navigator>
	);
}
