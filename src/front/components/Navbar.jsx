import { Link } from "react-router-dom";
import "../styles/components/Navbar.css";

export const Navbar = () => {

	return (
		<nav className="navbar border-bottom border-body" data-bs-theme="dark">

			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					<img src="https://res.cloudinary.com/dzvcmydip/image/upload/v1775255623/Bangover_tpirh3.ico" alt="Bangover logo" className="navbar-logo d-inline-block align-text-top" />
					<span className="navbar-title">BANGOVER</span>
				</a>
				<button type="button" className="btn btn-outline-light btn-navbar">Log In</button>
			</div>
		</nav>
	);
};