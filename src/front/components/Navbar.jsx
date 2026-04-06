import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import storeReducer from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";



export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();

	const navigate = useNavigate();
	const location = useLocation();

	const goToLogin = () => {
		navigate("/login");
	}

	const goToHome = () => {
		navigate("/");
	}

	const goToActivities = () => {
		navigate("/activities");
	}

	return (
		<nav className="navbar border-bottom border-body" data-bs-theme="dark">

			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					<img src="https://res.cloudinary.com/dzvcmydip/image/upload/v1775255623/Bangover_tpirh3.ico" alt="Bangover logo" className="navbar-logo d-inline-block align-text-top" />
					<span className="navbar-title" onClick={goToHome}>BANGOVER</span>
				</a>
				<div className="navbar-buttons d-flex align-items-center gap-2 ms-auto">
					{location.pathname !== "/" ? (
						<button type="button" className="btn btn-outline-light btn-navbar" onClick={goToHome}>
							Home
						</button>
					) : null}
					{store.token && location.pathname !== "/activities" ? (
						<button type="button" className="btn btn-outline-light btn-navbar" onClick={goToActivities}>
							Actividades
						</button>
					) : null}
					{!store.token ?
						<button type="button" className="btn btn-outline-light btn-navbar" onClick={goToLogin}>
							Log In
						</button>
						:
						<button type="button" className="btn btn-outline-light btn-navbar" onClick={() => dispatch({ type: "logout" })}>
							Log Out
						</button>
					}
				</div>
			</div>
		</nav>
	);
};