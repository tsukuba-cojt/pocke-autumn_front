import type { ReactNode } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const screenHeaderStyles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 60,
		paddingHorizontal: 24,
		paddingBottom: 16,
		backgroundColor: "#EFF2F6",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#343D45",
		flex: 1,
		textAlign: "center",
	},
	spacer: {
		width: 24,
	},
	rightButton: {
		position: "relative",
	},
	badge: {
		position: "absolute",
		top: -4,
		right: -4,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#FF6B9D",
	},
});

type ScreenHeaderProps = {
	title?: string;
	leftIcon?: keyof typeof Ionicons.glyphMap;
	onLeftPress?: () => void;
	rightIcon?: keyof typeof Ionicons.glyphMap;
	onRightPress?: () => void;
	rightComponent?: ReactNode;
	showBadge?: boolean;
};

export default function ScreenHeader({
	title,
	leftIcon,
	onLeftPress,
	rightIcon,
	onRightPress,
	rightComponent,
	showBadge = false,
}: ScreenHeaderProps) {
	return (
		<View style={screenHeaderStyles.header}>
			{/* Left Section */}
			{leftIcon ? (
				<Pressable onPress={onLeftPress}>
				<Ionicons name={leftIcon} size={24} color="#343D45" />
			</Pressable>
		) : (
			<View style={screenHeaderStyles.spacer} />
		)}

		{/* Center Section */}
		{title && <Text style={screenHeaderStyles.title}>{title}</Text>}

		{/* Right Section */}
		{rightComponent ? (
			rightComponent
		) : rightIcon ? (
			<Pressable onPress={onRightPress} style={screenHeaderStyles.rightButton}>
				<Ionicons name={rightIcon} size={24} color="#343D45" />
					{showBadge && <View style={screenHeaderStyles.badge} />}
				</Pressable>
			) : (
				<View style={screenHeaderStyles.spacer} />
			)}
		</View>
	);
}
