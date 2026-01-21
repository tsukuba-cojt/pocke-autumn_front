import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingProfile from "../screens/SettingProfile";
import type { AuthStackParamList } from "./types";
import CreateCommunity from "./CreateCommunity";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="SettingProfile" component={SettingProfile} />
			<Stack.Screen name="CreateCommunity" component={CreateCommunity} />
		</Stack.Navigator>
	);
}