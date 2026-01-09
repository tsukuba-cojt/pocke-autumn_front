import { createContext, type ReactNode, useContext, useState } from "react";

interface User {
	userId: string;
	// 必要に応じて他のユーザー情報を追加
}

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}

interface UserProviderProps {
	children: ReactNode;
	initialUser?: User | null;
}

export function UserProvider({
	children,
	initialUser = null,
}: UserProviderProps) {
	// 本番環境では、useState + useEffectでローカルストレージや認証状態を管理
	const [user, setUser] = useState<User | null>(initialUser);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

// 開発/デモ用のモックユーザー取得
export function getMockUser(): User {
	return {
		userId: "demo-user-123",
	};
}
