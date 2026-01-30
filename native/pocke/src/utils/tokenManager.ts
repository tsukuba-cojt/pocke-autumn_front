import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@pocke_auth_token";
const TOKEN_DATA_KEY = "@pocke_auth_token_data";
const TOKEN_EXPIRY_HOURS = 6;

interface TokenData {
	token: string;
	lastAccess: number;
}

/**
 * トークンを保存し、最後のアクセス時刻を記録
 */
export async function saveToken(token: string): Promise<void> {
	const tokenData: TokenData = {
		token,
		lastAccess: Date.now(),
	};
	await AsyncStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(tokenData));
	// 後方互換性のため、古いキーも保持
	await AsyncStorage.setItem(TOKEN_KEY, token);
}

/**
 * トークンを取得し、有効期限をチェック
 * 有効期限切れの場合はnullを返し、トークンを削除
 * 有効な場合は最後のアクセス時刻を更新
 */
export async function getToken(): Promise<string | null> {
	try {
		const tokenDataString = await AsyncStorage.getItem(TOKEN_DATA_KEY);
		
		if (!tokenDataString) {
			// 新しい形式のデータがない場合、古い形式を確認
			const oldToken = await AsyncStorage.getItem(TOKEN_KEY);
			if (oldToken) {
				// 古い形式から新しい形式に移行
				await saveToken(oldToken);
				return oldToken;
			}
			return null;
		}

		const tokenData: TokenData = JSON.parse(tokenDataString);
		const now = Date.now();
		const timeDiff = now - tokenData.lastAccess;
		const hoursDiff = timeDiff / (1000 * 60 * 60);

		// 6時間以上経過している場合は削除
		if (hoursDiff >= TOKEN_EXPIRY_HOURS) {
			console.log("トークンの有効期限が切れました。削除します。");
			await clearToken();
			return null;
		}

		// 有効な場合は最後のアクセス時刻を更新
		tokenData.lastAccess = now;
		await AsyncStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(tokenData));
		await AsyncStorage.setItem(TOKEN_KEY, tokenData.token);

		return tokenData.token;
	} catch (error) {
		console.error("トークン取得エラー:", error);
		return null;
	}
}

/**
 * トークンを削除
 */
export async function clearToken(): Promise<void> {
	await AsyncStorage.removeItem(TOKEN_DATA_KEY);
	await AsyncStorage.removeItem(TOKEN_KEY);
}

/**
 * トークンの最後のアクセス時刻を更新（API呼び出し時に使用）
 */
export async function updateTokenAccess(): Promise<void> {
	try {
		const tokenDataString = await AsyncStorage.getItem(TOKEN_DATA_KEY);
		if (tokenDataString) {
			const tokenData: TokenData = JSON.parse(tokenDataString);
			tokenData.lastAccess = Date.now();
			await AsyncStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(tokenData));
		}
	} catch (error) {
		console.error("トークンアクセス時刻更新エラー:", error);
	}
}
