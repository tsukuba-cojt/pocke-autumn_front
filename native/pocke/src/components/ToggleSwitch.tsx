import { View, Pressable, StyleSheet, Animated } from "react-native";
import { useRef, useEffect } from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
	value: boolean;
	onValueChange: (value: boolean) => void;
	disabled?: boolean;
};

export default function ToggleSwitch({ value, onValueChange, disabled = false }: Props) {
	console.log("ToggleSwitch received value:", value);
	const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

	useEffect(() => {
		Animated.spring(animatedValue, {
			toValue: value ? 1 : 0,
			useNativeDriver: false,
			friction: 6,
			tension: 40,
		}).start();
	}, [value, animatedValue]);

	const togglePosition = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [12, 66],
	});

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["#FFFFFF", "#F2ABAF"],
	});

	const handlePress = () => {
		if (!disabled) {
			onValueChange(!value);
		}
	};

	return (
		<Pressable onPress={handlePress} disabled={disabled}>
			<Animated.View style={[styles.container, { backgroundColor }]}>
				{/* 左側：家アイコン（OFF状態） */}
				<View style={styles.leftIcon}>
					<Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<Path
							d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
							stroke={value ? "#FFFFFF" : "#333333"}
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<Path
							d="M9 22V12H15V22"
							stroke={value ? "#FFFFFF" : "#333333"}
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</Svg>
				</View>

				{/* 右側：ユーザーアイコン（ON状態） */}
				<View style={styles.rightIcon}>
					<Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<Path
							d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 7.57 19.18 5.86 17.12C7.55 15.8 9.68 15 12 15C14.32 15 16.45 15.8 18.14 17.12C16.43 19.18 14.03 20 12 20Z"
							fill={value ? "#FFFFFF" : "#9E9E9E"}
						/>
					</Svg>
				</View>

				{/* 動くサム（選択インジケーター） */}
				<Animated.View style={[styles.thumb, { left: togglePosition }]} />
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 120,
		height: 56,
		borderRadius: 28,
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	thumb: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: "#F2ABAF",
		position: "absolute",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
		zIndex: 1,
	},
	leftIcon: {
		position: "absolute",
		left: 20,
		width: 24,
		height: 24,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
	},
	rightIcon: {
		position: "absolute",
		right: 20,
		width: 24,
		height: 24,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
	},
});
