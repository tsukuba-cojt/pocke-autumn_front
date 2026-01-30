import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { getToken } from "../utils/tokenManager";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
	prefixes: [
		'pocke://',
		'https://pocke-autumn-back.pocke-cojt.workers.dev',
	],
	config: {
		screens: {
			MainApp: {
				screens: {
					Home: {
						screens: {
							JoinCommunity: 'community/:communityId/join',
						},
					},
				},
			},
		},
	},
} as const;

export default function RootNavigator() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuthToken = async () => {
			try {
				const token = await getToken();
				if (token) {
					console.log("保存されたトークンを検出しました。自動ログインします。");
					setIsAuthenticated(true);
				} else {
					console.log("トークンが見つかりませんでした。");
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("トークンチェックエラー:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuthToken();
	}, []);

	if (isLoading) {
		return null; // またはローディングスクリーンを表示
	}

	return (
		// @ts-expect-error linking configuration type mismatch
		<NavigationContainer linking={linking}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{!isAuthenticated ? (
					<Stack.Screen name="Auth" component={AuthNavigator} />
				) : (
					<Stack.Screen name="MainApp" component={MainTabNavigator} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}