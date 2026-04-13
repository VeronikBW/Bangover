import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import "../styles/pages/AdminTools.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const initialFormState = {
    name: "",
    code: "",
    fc: "",
    password: "",
};

export const AdminUsersRegister = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = ({ target }) => {
        setFormState((previousState) => ({
            ...previousState,
            [target.name]: target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const normalizedName = formState.name.trim();
            const normalizedCode = formState.code.trim();
            const normalizedFc = formState.fc.trim();

            const formData = new FormData();
            formData.append("name", normalizedName);
            formData.append("code", normalizedCode);
            formData.append("fc", normalizedFc);
            formData.append("password", formState.password);

            const response = await fetch(`${backendUrl}/api/register`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage = data?.error || data?.message || "No se pudo registrar el usuario.";
                toast.error(errorMessage);
                return;
            }

            toast.success("Usuario registrado correctamente.", {
                description: `Nombre: ${normalizedName} | Código: ${normalizedCode} | FC: ${normalizedFc}. Redirigiendo a la lista...`,
                duration: 1800,
            });
            setFormState(initialFormState);
            setTimeout(() => {
                navigate("/admin/users");
            }, 900);
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Error de red al registrar usuario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-tools-body">
            <Toaster position="top-center" richColors />
            <div className="admin-tools-wrapper">
                <section className="admin-tools-card">
                    <h1>Registrar usuarios</h1>
                    <p>
                        Crea un nuevo usuario desde este panel. La imagen se asigna automáticamente por defecto.
                    </p>

                    <form className="admin-tools-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
                        <div className="admin-tools-form-grid">
                            <div className="admin-tools-field">
                                <label htmlFor="admin-user-name">Nombre</label>
                                <input
                                    id="admin-user-name"
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Nombre visible"
                                />
                            </div>

                            <div className="admin-tools-field">
                                <label htmlFor="admin-user-code">Código</label>
                                <input
                                    id="admin-user-code"
                                    type="text"
                                    name="code"
                                    value={formState.code}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="#Codigo"
                                />
                            </div>

                            <div className="admin-tools-field">
                                <label htmlFor="admin-user-fc">FC</label>
                                <input
                                    id="admin-user-fc"
                                    type="text"
                                    name="fc"
                                    value={formState.fc}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="FC"
                                />
                            </div>

                            <div className="admin-tools-field">
                                <label htmlFor="admin-user-password">Contraseña</label>
                                <input
                                    id="admin-user-password"
                                    type="password"
                                    name="password"
                                    value={formState.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Contraseña"
                                />
                            </div>
                        </div>

                        <div className="admin-tools-form-actions">
                            <button type="submit" className="admin-tools-submit-button" disabled={isSubmitting}>
                                {isSubmitting ? "Registrando..." : "Registrar usuario"}
                            </button>
                        </div>
                    </form>

                    <div className="admin-tools-actions">
                        <Link to="/admin" className="admin-tools-action-link">Volver al dashboard</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};
