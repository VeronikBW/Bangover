import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useActivityFavorites } from "../hooks/useActivityFavorites";
import { ActivityModal } from "./ActivityModal";
import "../styles/pages/activities/ActivityCategory.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
const TEST_ACTIVITY_IMAGE = "https://res.cloudinary.com/dzvcmydip/image/upload/v1775696643/img_prueba_actividad_ddyuzy.jpg";

const normalizeCategory = (value = "") => value.toString().trim().toLowerCase();

export const ActivityCategoryPage = ({
    title,
    description,
    categoryValue,
    badgeNote,
    subcategoryGroups = [],
}) => {
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
                return Number(firstActivity.id || 0) - Number(secondActivity.id || 0);
            });
    }, [activities, categoryValue]);

    const hasSubcategoryGroups = subcategoryGroups.length > 0;

    const groupedActivities = useMemo(() => {
        if (!hasSubcategoryGroups) return [];

        const configuredGroups = subcategoryGroups.map((group) => ({
            ...group,
            activities: filteredActivities.filter(
                (activity) => normalizeCategory(activity.subcategory) === normalizeCategory(group.value)
            ),
        }));

        const knownGroupValues = new Set(
            configuredGroups.map((group) => normalizeCategory(group.value))
        );

        const uncategorizedActivities = filteredActivities.filter((activity) => {
            const normalizedSubcategory = normalizeCategory(activity.subcategory);
            return normalizedSubcategory && !knownGroupValues.has(normalizedSubcategory);
        });

        if (uncategorizedActivities.length > 0) {
            configuredGroups.push({
                value: "sin-subcategoria",
                label: "Sin subcategoría",
                activities: uncategorizedActivities,
            });
        }

        return configuredGroups;
    }, [filteredActivities, hasSubcategoryGroups, subcategoryGroups]);

    const selectedActivityBadgeLabel = useMemo(() => {
        if (!selectedActivity || !hasSubcategoryGroups) return title;

        const matchingGroup = groupedActivities.find((group) =>
            group.activities.some((activity) => activity.id === selectedActivity.id)
        );

        return matchingGroup?.label || title;
    }, [groupedActivities, hasSubcategoryGroups, selectedActivity, title]);

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

    const renderActivityTable = (activitiesToRender) => (
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
                    {activitiesToRender.map((activity) => (
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
    );

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
                    hasSubcategoryGroups || filteredActivities.length > 0 ? (
                        <>
                            {hasSubcategoryGroups ? (
                                <div className="activity-subsections">
                                    {groupedActivities.map((group) => (
                                        <section key={group.value} className="activity-subsection">
                                            <div className="activity-subsection-header">
                                                <div className="activity-subsection-heading">
                                                    <div className="activity-subsection-title-row">
                                                        <h2 className="activity-subsection-title">{group.label}</h2>
                                                        {group.badgeNote ? (
                                                            <span className="activity-subsection-badge">{group.badgeNote}</span>
                                                        ) : null}
                                                    </div>
                                                    {group.description ? (
                                                        <p className="activity-subsection-description">{group.description}</p>
                                                    ) : null}
                                                </div>
                                                <span className="activity-subsection-count">
                                                    {group.activities.length} actividad{group.activities.length === 1 ? "" : "es"}
                                                </span>
                                            </div>

                                            {group.activities.length > 0 ? (
                                                renderActivityTable(group.activities)
                                            ) : (
                                                <p className="activity-category-message activity-subsection-empty">
                                                    Todavía no hay actividades registradas en esta subcategoría.
                                                </p>
                                            )}
                                        </section>
                                    ))}
                                </div>
                            ) : (
                                renderActivityTable(filteredActivities)
                            )}

                            {selectedActivity && (
                                <ActivityModal
                                    activity={selectedActivity}
                                    imageUrl={TEST_ACTIVITY_IMAGE}
                                    badgeLabel={selectedActivityBadgeLabel}
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
