import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navRef = useRef(null);

	const navigate = useNavigate();
	const location = useLocation();

	const handleNavigate = (path) => {
		setIsMenuOpen(false);
		navigate(path);
	};

	const goToLogin = () => {
		handleNavigate("/login");
	};

	const goToHome = () => {
		handleNavigate("/");
	};

	const goToActivities = () => {
		handleNavigate("/activities");
	};

	const goToProfile = () => {
		handleNavigate("/profile");
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		dispatch({ type: "logout" });
		setIsMenuOpen(false);
		navigate("/", { replace: true });
	};

	useEffect(() => {
		if (!isMenuOpen) return;

		const handleClickOutside = (event) => {
			if (navRef.current && !navRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		const handleEscape = (event) => {
			if (event.key === "Escape") {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		window.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isMenuOpen]);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	return (
		<nav ref={navRef} className="navbar navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
			<div className="container-fluid navbar-container">
				<button type="button" className="navbar-brand navbar-brand-button" onClick={goToHome}>
					<img src="https://res.cloudinary.com/dzvcmydip/image/upload/v1775255623/Bangover_tpirh3.ico" alt="Bangover logo" className="navbar-logo d-inline-block align-text-top" />
					<span className="navbar-title">BANGOVER</span>
				</button>

				<button
					className={`navbar-toggler ${isMenuOpen ? "is-open" : ""}`}
					type="button"
					onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
					aria-controls="mainNavbar"
					aria-expanded={isMenuOpen}
					aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
				>
					<span className="navbar-toggler-icon-custom" aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
					</span>
				</button>

				<div className={`collapse navbar-collapse justify-content-end ${isMenuOpen ? "show" : ""}`} id="mainNavbar">
					<div className="navbar-buttons ms-auto">
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
						{store.token && location.pathname !== "/profile" ? (
							<button type="button" className="btn btn-outline-light btn-navbar" onClick={goToProfile}>
								Mi perfil
							</button>
						) : null}
						{!store.token ? (
							<button type="button" className="btn btn-outline-light btn-navbar" onClick={goToLogin}>
								Iniciar Sesión
							</button>
						) : (
							<button type="button" className="btn btn-outline-light btn-navbar" onClick={handleLogout}>
								Cerrar Sesión
							</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};