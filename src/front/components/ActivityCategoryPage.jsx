import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useActivityFavorites } from "../hooks/useActivityFavorites";
import { ActivityModal } from "./ActivityModal";
import "../styles/pages/activities/ActivityCategory.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
const TEST_ACTIVITY_IMAGE = "https://res.cloudinary.com/dzvcmydip/image/upload/v1775696643/img_prueba_actividad_ddyuzy.jpg";

const normalizeCategory = (value = "") => value.toString().trim().toLowerCase();

export const ActivityCategoryPage = ({ title, description, categoryValue, badgeNote }) => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {
        token,
        favoritePendingId,
        favoriteFeedback,
        isFavorite,
        toggleFavorite,
    } = useActivityFavorites({
        backendUrl,
        authMessage: "Inicia sesión para guardar tus favoritos.",
    });

    useEffect(() => {
        const loadActivities = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/activities`);

                if (!response.ok) {
                    throw new Error("No se pudo obtener la lista de actividades");
                }

                const data = await response.json();
                setActivities(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading activities:", err);
                setError("No se pudo cargar la lista de actividades.");
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, []);

    const filteredActivities = useMemo(() => {
        const normalizedCategory = normalizeCategory(categoryValue);

        return activities
            .filter((activity) => normalizeCategory(activity.category) === normalizedCategory)
            .sort((firstActivity, secondActivity) => {
                const firstCode = firstActivity.code || "";
                const secondCode = secondActivity.code || "";
                return firstCode.localeCompare(secondCode, "es", { numeric: true });
            });
    }, [activities, categoryValue]);

    useEffect(() => {
        if (!selectedActivity) return;

        const existsInCategory = filteredActivities.some(
            (activity) => activity.id === selectedActivity.id
        );

        if (!existsInCategory) {
            setSelectedActivity(null);
        }
    }, [filteredActivities, selectedActivity]);

    const handleSelectActivity = (activity) => {
        setSelectedActivity(activity);
    };

    const handleRowKeyDown = (event, activity) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleSelectActivity(activity);
        }
    };

    const handleFavoriteClick = (event, activity) => {
        event.stopPropagation();
        toggleFavorite(activity);
    };

    return (
        <div className="activity-category-page">
            <div className="activity-category-card">
                <div className="activity-category-intro">
                    <div className="activity-category-badges">
                        <span className="activity-category-badge">Bangover</span>
                        {badgeNote ? <span className="activity-category-badge">{badgeNote}</span> : null}
                    </div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>

                <div className="activity-category-summary">
                    <span className="activity-category-count">
                        {filteredActivities.length} actividad{filteredActivities.length === 1 ? "" : "es"}
                    </span>
                    <span className="activity-category-hint">
                        Haz clic en una actividad para abrir su ficha.
                    </span>
                </div>

                {loading ? (
                    <p className="activity-category-message">Cargando actividades...</p>
                ) : null}

                {error ? (
                    <p className="activity-category-message activity-category-error">{error}</p>
                ) : null}

                {favoriteFeedback ? (
                    <p
                        className={`activity-category-message ${favoriteFeedback.type === "error"
                            ? "activity-category-error"
                            : "activity-category-success"
                            }`}
                    >
                        {favoriteFeedback.text}
                    </p>
                ) : null}

                {!loading && !error ? (
                    filteredActivities.length > 0 ? (
                        <>
                            <div className="activity-category-table-wrapper">
                                <table className="activity-category-table">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th className="activity-category-favorite-col">Favorito</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredActivities.map((activity) => (
                                            <tr
                                                key={activity.id}
                                                className={`activity-category-row${selectedActivity?.id === activity.id ? " activity-category-row-active" : ""}`}
                                                onClick={() => handleSelectActivity(activity)}
                                                onKeyDown={(event) => handleRowKeyDown(event, activity)}
                                                tabIndex={0}
                                            >
                                                <td>{activity.code}</td>
                                                <td>{activity.name}</td>
                                                <td className="activity-category-favorite-cell">
                                                    <button
                                                        type="button"
                                                        className={`activity-favorite-button${isFavorite(activity.id) ? " is-active" : ""}`}
                                                        onClick={(event) => handleFavoriteClick(event, activity)}
                                                        disabled={favoritePendingId === activity.id || !token}
                                                        aria-label={`${isFavorite(activity.id) ? "Quitar de" : "Guardar en"} favoritos ${activity.name}`}
                                                        title={
                                                            !token
                                                                ? "Inicia sesión para guardar favoritos"
                                                                : isFavorite(activity.id)
                                                                    ? "Quitar de favoritos"
                                                                    : "Guardar en favoritos"
                                                        }
                                                    >
                                                        {favoritePendingId === activity.id ? "…" : isFavorite(activity.id) ? "♥" : "♡"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selectedActivity && (
                                <ActivityModal
                                    activity={selectedActivity}
                                    imageUrl={TEST_ACTIVITY_IMAGE}
                                    badgeLabel={title}
                                    onClose={() => setSelectedActivity(null)}
                                    titleId="activity-detail-title"
                                    actionsClassName="activity-detail-actions activity-detail-actions-bottom"
                                    actions={
                                        <button
                                            type="button"
                                            className={`activity-favorite-button activity-favorite-button-modal${isFavorite(selectedActivity.id) ? " is-active" : ""}`}
                                            onClick={() => toggleFavorite(selectedActivity)}
                                            disabled={favoritePendingId === selectedActivity.id || !token}
                                        >
                                            {favoritePendingId === selectedActivity.id
                                                ? "Actualizando..."
                                                : isFavorite(selectedActivity.id)
                                                    ? "♥ Quitar de favoritos"
                                                    : "♡ Guardar en favoritos"}
                                        </button>
                                    }
                                />
                            )}
                        </>
                    ) : (
                        <p className="activity-category-message">
                            Todavía no hay actividades registradas en esta categoría.
                        </p>
                    )
                ) : null}

                <div className="activity-category-actions">
                    <Link to="/activities" className="activity-category-button">
                        Volver a actividades
                    </Link>
                </div>
            </div>
        </div>
    );
};
