import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/pages/AdminTools.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const categoryLabels = {
    drabbles: "Drabbles",
    "non-sex": "Non Sex",
    quotes: "Quotes",
    "sensible-content": "Sensible Content",
    explicit: "Explicit",
    "agnus-dei": "Agnus Dei",
    special: "Special",
    recordis: "Recordis",
    gallery: "Gallery",
    music: "Music",
};

const specialSubcategories = [
    { value: "", label: "Sin subcategoría" },
    { value: "omegaverse", label: "Omegaverse" },
    { value: "anais-nin", label: "Anais Nin" },
    { value: "circulo-de-los-celos", label: "Circulo de los Celos" },
    { value: "nos-pueden-ver", label: "Nos Pueden Ver" },
];

const initialEditForm = {
    name: "",
    code: "",
    description: "",
    subcategory: "",
};

export const AdminActivitiesCategory = () => {
    const { category } = useParams();
    const { store } = useGlobalReducer();

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [editForm, setEditForm] = useState(initialEditForm);
    const [codeError, setCodeError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const categoryName = categoryLabels[category] || category;
    const isSpecialCategory = category === "special";

    const sortedActivities = useMemo(() => {
        return [...activities].sort((firstActivity, secondActivity) => {
            return Number(firstActivity.id || 0) - Number(secondActivity.id || 0);
        });
    }, [activities]);

    const filteredActivities = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return sortedActivities;

        return sortedActivities.filter(
            (activity) =>
                (activity.code || "").toLowerCase().includes(query) ||
                (activity.name || "").toLowerCase().includes(query),
        );
    }, [sortedActivities, searchQuery]);

    const groupedSpecialActivities = useMemo(() => {
        if (!isSpecialCategory) return [];

        return specialSubcategories
            .map((subcategory) => {
                const activitiesInSubcategory = filteredActivities.filter(
                    (activity) => (activity.subcategory || "") === subcategory.value,
                );

                return {
                    key: subcategory.value || "sin-subcategoria",
                    label: subcategory.label,
                    items: activitiesInSubcategory,
                };
            })
            .filter((group) => group.items.length > 0);
    }, [filteredActivities, isSpecialCategory]);

    useEffect(() => {
        const loadActivities = async () => {
            if (!category) return;

            try {
                setIsLoading(true);
                setError("");

                const response = await fetch(`${backendUrl}/api/activities?category=${encodeURIComponent(category)}`, {
                    headers: { Authorization: `Bearer ${store.token}` },
                });
                const data = await response.json().catch(() => []);

                if (!response.ok) {
                    throw new Error("No se pudo obtener la lista de actividades.");
                }

                setActivities(Array.isArray(data) ? data : []);
            } catch (loadError) {
                console.error("Error loading activities:", loadError);
                setError("No se pudo cargar la lista de actividades.");
            } finally {
                setIsLoading(false);
            }
        };

        loadActivities();
    }, [category]);

    useEffect(() => {
        if (!selectedActivity) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeEditModal();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [selectedActivity]);

    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setCodeError("");
        setEditForm({
            name: activity.name || "",
            code: activity.code || "",
            description: activity.description || "",
            subcategory: activity.subcategory || "",
        });
    };

    const closeEditModal = () => {
        setSelectedActivity(null);
        setCodeError("");
        setEditForm(initialEditForm);
    };

    const handleEditChange = ({ target }) => {
        const { name, value } = target;
        if (name === "code" && codeError) {
            setCodeError("");
        }

        setEditForm((previousState) => ({
            ...previousState,
            [name]: value,
        }));
    };

    const saveActivity = async () => {
        if (!selectedActivity || isSaving) return;

        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append("name", editForm.name.trim());
            formData.append("code", editForm.code.trim());
            formData.append("description", editForm.description.trim());
            formData.append("category", category);
            if (isSpecialCategory) {
                formData.append("subcategory", editForm.subcategory);
            }

            const response = await fetch(`${backendUrl}/api/activities/${selectedActivity.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${store.token}`,
                },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const mergedErrorText = [data?.error, data?.message, data?.Error]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                const duplicateCodeError =
                    (mergedErrorText.includes("code") && mergedErrorText.includes("exist")) ||
                    (mergedErrorText.includes("unique") && mergedErrorText.includes("activity.code"));

                if (duplicateCodeError) {
                    const message = `El código "${editForm.code.trim()}" ya existe. No se pudo modificar.`;
                    setCodeError(message);
                    toast.error(message);
                } else {
                    toast.error(data?.error || data?.message || "No se pudo modificar la actividad.");
                }
                return;
            }

            setActivities((previousActivities) =>
                previousActivities.map((activity) =>
                    activity.id === selectedActivity.id
                        ? {
                            ...activity,
                            name: editForm.name.trim(),
                            code: editForm.code.trim(),
                            description: editForm.description.trim(),
                            subcategory: isSpecialCategory ? editForm.subcategory || null : null,
                        }
                        : activity,
                ),
            );

            toast.success("Actividad modificada correctamente.");
            closeEditModal();
        } catch (saveError) {
            console.error("Error updating activity:", saveError);
            toast.error("Error de red al modificar actividad.");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = (activity) => {
        toast.warning(`¿Eliminar actividad ${activity.name}?`, {
            description: `Código: ${activity.code}. Esta acción no se puede deshacer.`,
            duration: 6000,
            action: {
                label: "Eliminar",
                onClick: () => deleteActivity(activity.id, activity.name),
            },
            cancel: {
                label: "Cancelar",
            },
        });
    };

    const deleteActivity = async (activityId, activityName) => {
        try {
            const response = await fetch(`${backendUrl}/api/activities/${activityId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${store.token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                toast.error(data?.error || data?.message || "No se pudo eliminar la actividad.");
                return;
            }

            setActivities((previousActivities) =>
                previousActivities.filter((activity) => activity.id !== activityId),
            );
            if (selectedActivity?.id === activityId) closeEditModal();
            toast.success(`${activityName} eliminada correctamente.`);
        } catch (deleteError) {
            console.error("Error deleting activity:", deleteError);
            toast.error("Error de red al eliminar actividad.");
        }
    };

    return (
        <div className="admin-tools-body">
            <Toaster position="top-center" richColors />
            <div className="admin-tools-wrapper admin-tools-wrapper-wide">
                <section className="admin-tools-card">
                    <h1>Actividades: {categoryName}</h1>
                    <p>Lista simplificada de actividades. Usa Modificar para abrir el detalle completo.</p>

                    {isLoading ? <p className="admin-tools-message">Cargando actividades...</p> : null}
                    {error ? <p className="admin-tools-message admin-tools-message-error">{error}</p> : null}

                    {!isLoading && !error ? (
                        <>
                            <div className="admin-tools-summary">
                                <span className="activity-category-count">
                                    {filteredActivities.length} actividad{filteredActivities.length === 1 ? "" : "es"}
                                </span>
                            </div>

                            <div className="admin-tools-search">
                                <input
                                    type="search"
                                    className="admin-tools-search-input"
                                    placeholder="Buscar por código o nombre..."
                                    value={searchQuery}
                                    onChange={({ target }) => setSearchQuery(target.value)}
                                />
                                <span className="admin-tools-search-count">
                                    {filteredActivities.length} / {activities.length}
                                </span>
                            </div>

                            {filteredActivities.length === 0 ? (
                                <p className="admin-tools-message">No hay actividades que coincidan con la búsqueda.</p>
                            ) : null}

                            {isSpecialCategory
                                ? groupedSpecialActivities.map((group) => (
                                    <section key={group.key} className="admin-tools-subsection">
                                        <h3 className="admin-tools-subsection-title">
                                            {group.label}
                                            <span className="admin-tools-subsection-count">{group.items.length}</span>
                                        </h3>
                                        <div className="admin-tools-table-wrapper">
                                            <table className="admin-tools-table">
                                                <colgroup>
                                                    <col className="admin-tools-col-code" />
                                                    <col className="admin-tools-col-name" />
                                                    <col className="admin-tools-col-actions" />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th className="admin-tools-th-code">Código</th>
                                                        <th className="admin-tools-th-name">Nombre</th>
                                                        <th className="admin-tools-th-actions">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.items.map((activity) => (
                                                        <tr key={activity.id}>
                                                            <td className="admin-tools-td-code" title={activity.code}>{activity.code}</td>
                                                            <td className="admin-tools-td-name" title={activity.name}>{activity.name}</td>
                                                            <td className="admin-tools-td-actions">
                                                                <div className="admin-tools-table-actions admin-tools-table-actions-inline">
                                                                    <button
                                                                        type="button"
                                                                        className="admin-tools-mini-button"
                                                                        onClick={() => openEditModal(activity)}
                                                                    >
                                                                        Modificar
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-tools-mini-button is-danger"
                                                                        onClick={() => confirmDelete(activity)}
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                ))
                                : (
                                    <div className="admin-tools-table-wrapper">
                                        <table className="admin-tools-table">
                                            <colgroup>
                                                <col className="admin-tools-col-code" />
                                                <col className="admin-tools-col-name" />
                                                <col className="admin-tools-col-actions" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th className="admin-tools-th-code">Código</th>
                                                    <th className="admin-tools-th-name">Nombre</th>
                                                    <th className="admin-tools-th-actions">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredActivities.map((activity) => (
                                                    <tr key={activity.id}>
                                                        <td className="admin-tools-td-code" title={activity.code}>{activity.code}</td>
                                                        <td className="admin-tools-td-name" title={activity.name}>{activity.name}</td>
                                                        <td className="admin-tools-td-actions">
                                                            <div className="admin-tools-table-actions admin-tools-table-actions-inline">
                                                                <button
                                                                    type="button"
                                                                    className="admin-tools-mini-button"
                                                                    onClick={() => openEditModal(activity)}
                                                                >
                                                                    Modificar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="admin-tools-mini-button is-danger"
                                                                    onClick={() => confirmDelete(activity)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                        </>
                    ) : null}

                    <div className="admin-tools-actions">
                        <Link to="/admin/activities" className="admin-tools-action-link">Volver a categorías</Link>
                    </div>
                </section>
            </div>

            {selectedActivity ? (
                <div className="admin-tools-modal-overlay" onClick={closeEditModal}>
                    <section className="admin-tools-modal-card" onClick={(event) => event.stopPropagation()}>
                        <header className="admin-tools-modal-header">
                            <div>
                                <h2>Editar actividad</h2>
                                <p>{categoryName}</p>
                            </div>
                            <button
                                type="button"
                                className="admin-tools-modal-close"
                                onClick={closeEditModal}
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        </header>

                        <div className="admin-tools-modal-body">
                            <div className="admin-tools-form-grid">
                                <div className="admin-tools-field">
                                    <label htmlFor="admin-edit-activity-name">Nombre</label>
                                    <input
                                        id="admin-edit-activity-name"
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="admin-tools-field">
                                    <label htmlFor="admin-edit-activity-code">Código</label>
                                    <input
                                        id="admin-edit-activity-code"
                                        type="text"
                                        name="code"
                                        value={editForm.code}
                                        onChange={handleEditChange}
                                        className={codeError ? "admin-tools-input-error" : ""}
                                        disabled={isSaving}
                                    />
                                    {codeError ? <span className="admin-tools-field-error">{codeError}</span> : null}
                                </div>

                                {isSpecialCategory ? (
                                    <div className="admin-tools-field">
                                        <label htmlFor="admin-edit-activity-subcategory">Subcategoría</label>
                                        <select
                                            id="admin-edit-activity-subcategory"
                                            name="subcategory"
                                            value={editForm.subcategory}
                                            onChange={handleEditChange}
                                            className="admin-tools-select"
                                            disabled={isSaving}
                                        >
                                            {specialSubcategories.map((subcategory) => (
                                                <option key={subcategory.value || "none"} value={subcategory.value}>
                                                    {subcategory.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : null}
                            </div>

                            <div className="admin-tools-field admin-tools-field-full">
                                <label htmlFor="admin-edit-activity-description">Descripción</label>
                                <textarea
                                    id="admin-edit-activity-description"
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    className="admin-tools-textarea"
                                    rows={5}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <footer className="admin-tools-modal-footer">
                            <button
                                type="button"
                                className="admin-tools-mini-button is-secondary"
                                onClick={closeEditModal}
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="admin-tools-mini-button"
                                onClick={saveActivity}
                                disabled={isSaving}
                            >
                                {isSaving ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </footer>
                    </section>
                </div>
            ) : null}
        </div>
    );
};
