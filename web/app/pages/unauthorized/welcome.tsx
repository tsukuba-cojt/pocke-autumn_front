import { useNavigate } from "react-router";

const logoPath = "/logo.svg"

function Welcome() {
	const navigate = useNavigate();
	return (
		<div className="flex h-screen w-full items-center justify-center bg-white">
			<div className="flex w-full flex-col items-center gap-8">
				<div>
          <img src={logoPath} alt="App Logo" ></img>
        </div>


        <div className="flex-1" />
        
        <div className="flex  w-full flex-col gap-4">
          <button
            type="button"
            className=" mx-8 rounded-2xl bg-accent py-3 text-lg font-black text-white shadow-lg shadow-accent/40 transition-all"
            onClick={() => navigate("/register")}
          >
            新規登録
          </button>

          <button
            type="button"
            className="mx-8 rounded-x2 border-2 border-accent/40 py-3 text-base font-black text-accent transition-all active:scale-[0.98]"
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
