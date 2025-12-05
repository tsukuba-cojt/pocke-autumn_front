import { QRCodeSVG } from "qrcode.react";

const QrReader = () => {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="aspect-square h-72 w-72 rounded-md bg-white p-4">
				<QRCodeSVG value={`http://localhost:5173`} size={224} />
			</div>
		</main>
	);
};

export default QrReader;
