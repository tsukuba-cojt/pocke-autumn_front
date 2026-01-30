import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import SettingProfile from "../screens/SettingProfile";
import EditProfileScreen from "../screens/EditProfileScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ChangeEmailScreen from "../screens/ChangeEmailScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import type { ProfileStackParamList } from "./types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="ProfileHome" component={ProfileScreen} />
			<Stack.Screen name="SettingProfile" component={SettingProfile} />
			<Stack.Screen name="EditProfile" component={EditProfileScreen} />
			<Stack.Screen name="Favorites" component={FavoritesScreen} />
			<Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
			<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
		</Stack.Navigator>
	);
}
