import { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/pages/AdminTools.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const CATEGORIES = [
    { value: "drabbles", label: "Drabbles" },
    { value: "non-sex", label: "Non Sex" },
    { value: "quotes", label: "Quotes" },
    { value: "sensible-content", label: "Sensible Content" },
    { value: "explicit", label: "Explicit" },
    { value: "agnus-dei", label: "Agnus Dei" },
    { value: "special", label: "Special" },
    { value: "recordis", label: "Recordis" },
    { value: "gallery", label: "Gallery" },
    { value: "music", label: "Music" },
];

const SPECIAL_SUBCATEGORIES = [
    { value: "omegaverse", label: "Omegaverse" },
    { value: "anais-nin", label: "Anaïs Nin" },
    { value: "circulo-de-los-celos", label: "Círculo de los Celos" },
    { value: "nos-pueden-ver", label: "Nos Pueden Ver" },
];

const initialFormState = {
    name: "",
    code: "",
    category: "",
    subcategory: "",
    description: "",
};

export const AdminActivitiesRegister = () => {
    const { store } = useGlobalReducer();
    const [formState, setFormState] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeError, setCodeError] = useState("");

    const isSpecial = formState.category === "special";

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (name === "code" && codeError) {
            setCodeError("");
        }
        setFormState((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "category" && value !== "special" ? { subcategory: "" } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", formState.name.trim());
            formData.append("code", formState.code.trim());
            formData.append("category", formState.category);
            formData.append("description", formState.description.trim());
            if (isSpecial && formState.subcategory) {
                formData.append("subcategory", formState.subcategory);
            }

            const response = await fetch(`${backendUrl}/api/activities`, {
                method: "POST",
                headers: { Authorization: `Bearer ${store.token}` },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const normalizedErrorText = [data?.error, data?.message, data?.Error]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                const isDuplicatedCode =
                    (normalizedErrorText.includes("code") && normalizedErrorText.includes("exist")) ||
                    (normalizedErrorText.includes("unique") && normalizedErrorText.includes("activity.code"));

                if (isDuplicatedCode) {
                    setCodeError(`El código "${formState.code.trim()}" ya existe. No se agregó la actividad.`);
                    toast.error(`El código "${formState.code.trim()}" ya existe. No se agregó la actividad.`);
                } else {
                    setCodeError("");
                    toast.error(data?.error || data?.message || "No se pudo registrar la actividad.");
                }
                return;
            }

            setCodeError("");
            const categoryLabel = CATEGORIES.find((c) => c.value === formState.category)?.label || formState.category;
            const subcategoryLabel = isSpecial && formState.subcategory
                ? SPECIAL_SUBCATEGORIES.find((s) => s.value === formState.subcategory)?.label || formState.subcategory
                : null;

            toast.success("Actividad registrada correctamente.", {
                description: `${formState.name.trim()} · ${categoryLabel}${subcategoryLabel ? ` · ${subcategoryLabel}` : ""} · Código: ${formState.code.trim()}.`,
                duration: 3000,
            });
            setFormState(initialFormState);
        } catch (err) {
            console.error("Error creating activity:", err);
            toast.error("Error de red al registrar actividad.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-tools-body">
            <Toaster position="top-center" richColors />
            <div className="admin-tools-wrapper">
                <section className="admin-tools-card">
                    <h1>Registrar actividades</h1>
                    <p>Crea una nueva actividad. La subcategoría solo aplica a la categoría Special.</p>

                    <form className="admin-tools-form" onSubmit={handleSubmit} aria-busy={isSubmitting} autoComplete="off">
                        <div className="admin-tools-form-grid">

                            <div className="admin-tools-field">
                                <label htmlFor="act-name">Nombre</label>
                                <input
                                    id="act-name"
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    value={formState.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Nombre de la actividad"
                                />
                            </div>

                            <div className="admin-tools-field">
                                <label htmlFor="act-code">Código</label>
                                <input
                                    id="act-code"
                                    type="text"
                                    name="code"
                                    autoComplete="off"
                                    value={formState.code}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    className={codeError ? "admin-tools-input-error" : ""}
                                    placeholder="Código único"
                                />
                                {codeError ? <span className="admin-tools-field-error">{codeError}</span> : null}
                            </div>

                            <div className="admin-tools-field">
                                <label htmlFor="act-category">Categoría</label>
                                <select
                                    id="act-category"
                                    name="category"
                                    autoComplete="off"
                                    value={formState.category}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    className="admin-tools-select"
                                >
                                    <option value="">— Selecciona —</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-tools-field">
                                <label htmlFor="act-subcategory">
                                    Subcategoría
                                    {!isSpecial && (
                                        <span className="admin-tools-field-hint"> (solo para Special)</span>
                                    )}
                                </label>
                                <select
                                    id="act-subcategory"
                                    name="subcategory"
                                    autoComplete="off"
                                    value={formState.subcategory}
                                    onChange={handleChange}
                                    disabled={isSubmitting || !isSpecial}
                                    className={`admin-tools-select${!isSpecial ? " is-disabled" : ""}`}
                                >
                                    <option value="">— Ninguna —</option>
                                    {SPECIAL_SUBCATEGORIES.map((sub) => (
                                        <option key={sub.value} value={sub.value}>
                                            {sub.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="admin-tools-field admin-tools-field-full">
                            <label htmlFor="act-description">Descripción</label>
                            <textarea
                                id="act-description"
                                name="description"
                                autoComplete="off"
                                value={formState.description}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                placeholder="Descripción de la actividad (opcional)"
                                rows={4}
                                className="admin-tools-textarea"
                            />
                        </div>

                        <div className="admin-tools-form-actions">
                            <button
                                type="submit"
                                className="admin-tools-submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registrando..." : "Registrar actividad"}
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
