import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

function Welcome() {
	const navigate = useNavigate();
	return (
		<div>
			<Button onClick={() => navigate("/login")}>login</Button>
			<Button onClick={() => navigate("/register")}>register</Button>
		</div>
	);
}

export default Welcome;
