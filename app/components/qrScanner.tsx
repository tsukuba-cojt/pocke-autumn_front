import jsQR from "jsqr";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export function QrCodeScanner() {
	const navigate = useNavigate();
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const [isScanning, setIsScanning] = useState(false);
	const animationFrameRef = useRef<number | null>(null);

	const scanQrCode = useCallback(() => {
		const canvas = canvasRef.current;
		const video = videoRef.current;

		if (!canvas || !video) {
			animationFrameRef.current = requestAnimationFrame(scanQrCode);
			return;
		}

		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			if (ctx) {
				// カメラの映像をcanvasに描画
				canvas.height = video.videoHeight;
				canvas.width = video.videoWidth;
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

				// QRコードをスキャン（複数のオプションで試行）
				const code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: "attemptBoth",
				});

				if (code && code.data) {
					console.log("QR Code detected:", code.data);
					setResult(code.data);
					setError("");
					setIsScanning(false);
					// スキャン成功したらアニメーションフレームをキャンセル
					if (animationFrameRef.current) {
						cancelAnimationFrame(animationFrameRef.current);
						animationFrameRef.current = null;
					}
					return;
				}
			}
		}

		// 継続してスキャン
		animationFrameRef.current = requestAnimationFrame(scanQrCode);
	}, []);

	useEffect(() => {
		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play();
					setIsScanning(true);
					animationFrameRef.current = requestAnimationFrame(scanQrCode);
				}
			} catch (err) {
				console.error("Camera error:", err);
				setError("カメラへのアクセスに失敗しました");
			}
		};

		startCamera();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (videoRef.current?.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				const tracks = stream.getTracks();
				for (const track of tracks) {
					track.stop();
				}
			}
		};
	}, [scanQrCode]);

	if (result) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p className="text-sm text-green-600">✓ QRコードを読み取りました</p>
				<button
					type="button"
					onClick={() => navigate(result)}
					className="rounded-full bg-gray-600 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700"
				>
					移動
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative h-[300px] w-[300px] overflow-hidden rounded-lg border-2 border-gray-300">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className="h-full w-full object-cover"
				>
					<track kind="captions" />
				</video>
				<canvas
					ref={canvasRef}
					className="absolute left-0 top-0 h-full w-full opacity-0"
				/>
				{isScanning && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div className="h-48 w-48 border-2 border-white opacity-50" />
					</div>
				)}
			</div>
			<p className="text-sm text-gray-600">QRコードをカメラに映してください</p>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
}
