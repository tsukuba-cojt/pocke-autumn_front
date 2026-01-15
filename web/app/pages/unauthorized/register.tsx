import { useNavigate } from "react-router";
import type { Route } from "../../../types/web/app/pages/unauthorized/+types/register";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "新規登録" },
		{ name: "description", content: "新規登録ページ" },
	];
}

const logoPath = "/logo.svg"

export default function Register() {
  const navigate = useNavigate();
	return (
		<div className="flex min-h-screen flex-col w-full items-center justify-center bg-muted">
      <div className="mb-8">
          <img src={logoPath} alt="App Logo" ></img>
      </div>
			<div className="flex w-full rounded-x2 p-8 max-w-sm flex-col px-6 bg-white">
				<h1 className="mb-8 text-center text-lg font-bold text-gray">
					新規登録
				</h1>
				<form className="flex w-full text-md flex-col gap-3">
          <label className="font-normal text-primary">メールアドレス</label>
					<input
						type="text"
            placeholder="your@example.com"
						className="h-11 w-full rounded-md bg-muted px-4 text-sm text-primary placeholder:text-gray-300"
					/>
          <label className="font-normal text-primary">パスワード</label>
					<input
						type="password"
            placeholder="••••••••"
						className="h-11 w-full rounded-md bg-muted px-4 text-sm text-primary placeholder:text-gray-300"
					/>
					<button
						type="submit"
						className="mt-4 h-11 w-full rounded-x2 shadow-lg shadow-accent/40 text-md bg-accent font-medium text-white "
					>
						登録
					</button>

          <div className="mt-4 text-center">
            <div className="text-sm text-center text-gray-500">
              既にアカウントをお持ちですか？

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-1 font-black text-accent decoration-2 underline-offset-4"
            >
              ログインはこちら
            </button>
            </div>
          </div>

					<div className="flex my-5 w-full items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-200"></div>
          </div>
					<button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white py-3 text-base font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Googleで新規登録</span>
          </button>
				</form>
			</div>
		</div>
	);
}
