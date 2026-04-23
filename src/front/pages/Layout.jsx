import { useEffect } from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/pages/Layout.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
const AGE_VERIFICATION_KEY = "bangover-age-verification";
const AGE_VERIFICATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hasValidAgeVerification = () => {
    try {
        const rawVerification = localStorage.getItem(AGE_VERIFICATION_KEY);
        if (!rawVerification) return false;

        const parsedVerification = JSON.parse(rawVerification);
        const verifiedAt = Number(parsedVerification?.verifiedAt || 0);

        if (!verifiedAt) return false;

        return Date.now() - verifiedAt < AGE_VERIFICATION_TTL_MS;
    } catch (error) {
        console.error("Error checking age verification:", error);
        return false;
    }
};

const clearExpiredSession = (dispatch, navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigate("/login", { replace: true, state: { sessionExpired: true } });
};

const getTokenExpirationTime = (token) => {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = normalizedPayload.padEnd(
            normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
            "="
        );

        const decodedPayload = JSON.parse(atob(paddedPayload));
        return typeof decodedPayload.exp === "number"
            ? decodedPayload.exp * 1000
            : null;
    } catch (error) {
        console.error("Error decoding token expiration:", error);
        return null;
    }
};

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [isAgeVerified, setIsAgeVerified] = useState(() => hasValidAgeVerification());

    const confirmAgeVerification = () => {
        localStorage.setItem(
            AGE_VERIFICATION_KEY,
            JSON.stringify({ verifiedAt: Date.now() })
        );
        setIsAgeVerified(true);
    };

    const leaveSite = () => {
        window.location.replace("https://www.google.com");
    };

    useEffect(() => {
        const loadFavorites = async () => {
            if (!store.token) {
                dispatch({ type: "set_favorities", payload: [] });
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/api/favorites`, {
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                    },
                });

                if (response.status === 401) {
                    clearExpiredSession(dispatch, navigate);
                    return;
                }

                if (!response.ok) {
                    throw new Error("No se pudieron cargar los favoritos");
                }

                const data = await response.json();
                dispatch({
                    type: "set_favorities",
                    payload: data.favorites || [],
                });
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };

        loadFavorites();
    }, [store.token, dispatch, navigate]);

    useEffect(() => {
        if (!store.token) return undefined;

        const expirationTime = getTokenExpirationTime(store.token);

        if (!expirationTime) return undefined;

        if (Date.now() >= expirationTime) {
            clearExpiredSession(dispatch, navigate);
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            clearExpiredSession(dispatch, navigate);
        }, expirationTime - Date.now());

        return () => window.clearTimeout(timeoutId);
    }, [store.token, dispatch, navigate]);

    if (!isAgeVerified) {
        return (
            <ScrollToTop>
                <div className="layout-page age-gate-page" aria-labelledby="global-age-gate-title">
                    <main className="global-age-gate-card" role="dialog" aria-modal="true">
                        <div className="global-age-gate-badges">
                            <span>Bangover</span>
                            <span>Acceso restringido</span>
                            <span>+18</span>
                        </div>
                        <h1 id="global-age-gate-title">Verificación de edad</h1>
                        <p>
                            Bangover contiene contenido para personas adultas. Para continuar,
                            confirma que tienes al menos 18 años.
                        </p>
                        <div className="global-age-gate-actions">
                            <button
                                type="button"
                                className="global-age-gate-confirm"
                                onClick={confirmAgeVerification}
                            >
                                Soy mayor de 18 años
                            </button>
                            <button
                                type="button"
                                className="global-age-gate-exit"
                                onClick={leaveSite}
                            >
                                Salir del sitio
                            </button>
                        </div>
                        <p className="global-age-gate-note">
                            Esta confirmación se volverá a solicitar dentro de 7 días.
                        </p>
                    </main>
                </div>
            </ScrollToTop>
        );
    }

    return (
        <ScrollToTop>
            <div className="layout-page">
                <Navbar />
                <Outlet />
                <Footer />
            </div>
        </ScrollToTop>
    );
};