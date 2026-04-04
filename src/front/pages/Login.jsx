import "../styles/pages/Login.css";
import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const initialUser = {
    nickname: "",
    password: "",
}

export const Login = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUser);

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("nickname", user.nickname);
            formData.append("password", user.password);

            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: "set_token", payload: data.access_token });

                setUser(initialUser);
                const userResponse = await fetch(`${backendUrl}/api/user`, {
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });

                const userData = await userResponse.json();
                dispatch({
                    type: "set_user",
                    payload: userData.user
                })

                const favoritiesResponse = await fetch(`${backendUrl}/api/favorities`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });

                if (favoritiesResponse.ok) {
                    const favoritiesData = await favoritiesResponse.json();
                    dispatch({
                        type: "set_favorities",
                        payload: favoritiesData.favorities
                    });
                }

                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(userData.user));

                navigate("/");
            } else {
                toast.error("Nickname o contraseña incorrectos");
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
        }
    }


    return (
        <div className="login-body">
            <Toaster position="top-center" />
            <div className="login-card-wrapper">
                <form className="login-card" onSubmit={handleSubmit}>
                    <h1 className="login-title text-center">Inicia sesión</h1>
                    <div className="form-group mb-4">
                        <label htmlFor="forEmail">Nickname</label>
                        <input
                            type="text"
                            className="form-control"
                            id="forEmail"
                            placeholder="Me llaman..."
                            name="nickname"
                            value={user.nickname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="forPassword">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="forPassword"
                            placeholder="Contraseña"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="boton-registrar btn mb-3">
                        Iniciar sesión
                    </button>
                    <p className="login-note">Si olvidaste tu contraseña, contacta a la administración.</p>
                </form>
            </div>
        </div>
    );
};