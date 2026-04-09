import { useEffect } from "react";
import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/pages/Layout.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();

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
    }, [store.token, dispatch]);

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