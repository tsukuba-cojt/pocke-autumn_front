import { useNavigate } from "react-router";

function Welcome() {
	const navigate = useNavigate();
	return (
		<div className="flex h-screen w-full items-center justify-center bg-brand">
			<div className="flex flex-col items-center gap-8">
				<p className="text-lg font-normal text-black mb-44">ようこそ！！</p>
				<div className="flex flex-col gap-3">
					<button
						type="button"
						className="w-40 rounded-full bg-gray-600 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700"
						onClick={() => navigate("/register")}
					>
						新規登録
					</button>
					<button
						type="button"
						className="w-40 rounded-full bg-gray-600 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700"
						onClick={() => navigate("/login")}
					>
						ログイン
					</button>
				</div>
			</div>
		</div>
	);
}

export default Welcome;
