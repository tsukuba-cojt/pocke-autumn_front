import { View, Text, StyleSheet, Pressable } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/types";
import Logo from "../components/Logo";

type Props = {
	navigation: NativeStackNavigationProp<AuthStackParamList, "Welcome">;
};

export default function WelcomeScreen({ navigation }: Props) {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Logo width={150} height={52} />
			</View>

			<View style={styles.buttonContainer}>
				<Pressable
					style={styles.registerButton}
					onPress={() => navigation.navigate("Register")}
				>
					<Text style={styles.registerButtonText}>新規登録</Text>
				</Pressable>

				<Pressable
					style={styles.loginButton}
					onPress={() => navigation.navigate("Login")}
				>
					<Text style={styles.loginButtonText}>ログイン</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EFF2F6",
		justifyContent: "space-between",
		padding: 24,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	subtitle: {
		fontSize: 18,
		color: "#343D45",
		marginTop: 16,
	},
	buttonContainer: {
		gap: 16,
		marginBottom: 40,
	},
	registerButton: {
		backgroundColor: "#F2ABAF",
		paddingVertical: 16,
		borderRadius: 24,
		alignItems: "center",
	},
	registerButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	loginButton: {
		backgroundColor: "#fff",
		paddingVertical: 16,
		borderRadius: 24,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#F2ABAF",
	},
	loginButtonText: {
		color: "#F2ABAF",
		fontSize: 16,
		fontWeight: "600",
	},
});