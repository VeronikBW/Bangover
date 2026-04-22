import "../styles/pages/Login.css";
import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const initialUser = {
    code: "",
    password: "",
}

export const Login = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(initialUser);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state?.sessionExpired) {
            toast.error("Tu sesión expiró. Inicia sesión nuevamente.");
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("code", user.code);
            formData.append("password", user.password);

            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: "set_token", payload: data.access_token });

                setUser(initialUser);
                const userResponse = await fetch(`${backendUrl}/api/profile`, {
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });

                if (!userResponse.ok) {
                    toast.error("Error al obtener datos de usuario");
                    return;
                }

                const userData = await userResponse.json();
                dispatch({
                    type: "set_user",
                    payload: userData
                });

                const favoritiesResponse = await fetch(`${backendUrl}/api/favorites`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });

                if (favoritiesResponse.ok) {
                    const favoritiesData = await favoritiesResponse.json();
                    dispatch({
                        type: "set_favorities",
                        payload: favoritiesData.favorites
                    });
                }

                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(userData));

                navigate("/profile");
            } else {
                toast.error("Code o contraseña incorrectos");
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
            toast.error("No se pudo iniciar sesión. Revisa la conexión o la URL del backend.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="login-body">
            <Toaster position="top-center" />
            <div className="login-card-wrapper">
                <form className="login-card" onSubmit={handleSubmit} aria-busy={isLoading} autoComplete="on">
                    <h1 className="login-title text-center">Inicia sesión</h1>
                    <div className="form-group mb-4">
                        <label htmlFor="forEmail">Código</label>
                        <input
                            type="text"
                            className="form-control"
                            id="forEmail"
                            placeholder="#Código"
                            name="code"
                            autoComplete="username"
                            value={user.code}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <div id="emailHelp" className="form-text">Recuerda añadir el hastag(#) al inicio de tu código.</div>
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="forPassword">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="forPassword"
                            placeholder="Contraseña"
                            name="password"
                            autoComplete="current-password"
                            value={user.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" className="boton-registrar btn mb-3" disabled={isLoading}>
                        {isLoading ? (
                            <span className="login-loading-content">
                                <span className="login-spinner" aria-hidden="true"></span>
                                Cargando...
                            </span>
                        ) : (
                            "Iniciar sesión"
                        )}
                    </button>
                    <p className="login-note">Si olvidaste tu contraseña, contacta a la administración.</p>
                </form>
            </div>
        </div>
    );
};