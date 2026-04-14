import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useActivityFavorites } from "../hooks/useActivityFavorites";
import { ActivityModal } from "../components/ActivityModal";
import "../styles/pages/Profile.css";
import "../styles/pages/activities/ActivityCategory.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
const CATEGORY_IMAGES = {
    "drabbles": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136938/Actividad_drabble_yjwcvw.jpg",
    "non-sex": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136935/actividad_non_sex_bfk529.jpg",
    "quotes": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136934/Actividad_quotes_ahr162.jpg",
    "sensible-content": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136935/Actividad_s_content_hjnqbl.jpg",
    "explicit": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136934/Actividad_explicit_xwnklw.jpg",
    "agnus-dei": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136938/Actividad_agnus_dei_xe4qhu.jpg",
    "special": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136937/Actividad_special_dyheuk.jpg",
    "recordis": "https://res.cloudinary.com/dzvcmydip/image/upload/v1776136936/Actividad_re_cordis_vaje4s.jpg",
    "gallery": "https://res.cloudinary.com/dzvcmydip/image/upload/v1775254377/Logo_de_p%C3%A1gina_de_inicio_vmyrrk.png",
    "music": "https://res.cloudinary.com/dzvcmydip/image/upload/v1775254377/Logo_de_p%C3%A1gina_de_inicio_vmyrrk.png",
};
const PROFILE_AVATAR_IMAGE = "https://res.cloudinary.com/dzvcmydip/image/upload/v1775254377/Logo_de_p%C3%A1gina_de_inicio_vmyrrk.png";

const formatLabel = (value = "") => {
    const normalizedValue = value.toString().replaceAll("_", " ").trim().toLowerCase();
    return normalizedValue ? normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1) : "-";
};

const getCategoryRoute = (category = "") => {
    const normalizedValue = category
        .toString()
        .trim()
        .toLowerCase()
        .replaceAll("_", "-")
        .replaceAll(" ", "-");

    return `/activities/${normalizedValue}`;
};

export const Profile = () => {
    const { store } = useGlobalReducer();
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(Boolean(store.token));
    const [error, setError] = useState(null);
    const { favoritePendingId, favoriteFeedback, removeFavorite } = useActivityFavorites({
        backendUrl,
        onSuccess: (message) => toast.success(message),
        onError: (message) => toast.error(message),
    });

    useEffect(() => {
        const loadActivities = async () => {
            if (!store.token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/api/activities`, {
                    headers: { Authorization: `Bearer ${store.token}` },
                });

                if (!response.ok) {
                    throw new Error("No se pudieron cargar las actividades favoritas.");
                }

                const data = await response.json();
                setActivities(Array.isArray(data) ? data : []);
            } catch (fetchError) {
                console.error("Error loading profile favorites:", fetchError);
                setError("No se pudieron cargar los favoritos del perfil.");
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, [store.token]);

    const favoriteActivities = useMemo(() => {
        const favoriteIds = new Set((store.favorities || []).map((favorite) => Number(favorite.activity_id)));

        return activities
            .filter((activity) => favoriteIds.has(Number(activity.id)))
            .sort((firstActivity, secondActivity) => {
                const firstName = firstActivity.name || "";
                const secondName = secondActivity.name || "";
                return firstName.localeCompare(secondName, "es");
            });
    }, [activities, store.favorities]);

    useEffect(() => {
        if (!selectedActivity) return;

        const stillExists = favoriteActivities.some((activity) => activity.id === selectedActivity.id);

        if (!stillExists) {
            setSelectedActivity(null);
        }
    }, [favoriteActivities, selectedActivity]);

    const handleRowKeyDown = (event, activity) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedActivity(activity);
        }
    };

    const confirmRemoveFavorite = (activity) => {
        toast.error("¿Seguro que quieres eliminar este favorito?", {
            description: activity.name,
            duration: 6000,
            action: {
                label: "Eliminar",
                onClick: () => removeFavorite(activity),
            },
            cancel: {
                label: "Cancelar",
            },
        });
    };

    if (!store.token || !store.user) {
        return (
            <div className="profile-body">
                <div className="profile-wrapper">
                    <div className="profile-card profile-empty-card">
                        <h1>Mi perfil</h1>
                        <p>Inicia sesión para ver tu foto, tus datos y tus actividades favoritas.</p>
                        <Link to="/login" className="profile-button">
                            Ir a iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-body">
            <Toaster position="top-center" richColors />
            <div className="profile-wrapper">
                <div className="profile-card profile-main-card">
                    <div className="profile-header">
                        <span className="profile-badge">Bangover </span>
                        <h1>Mi perfil</h1>
                        <p>Consulta tu información personal y abre tus actividades favoritas desde la lista.</p>
                    </div>

                    <div className="profile-grid">
                        <aside className="profile-user-card">
                            <img
                                src={PROFILE_AVATAR_IMAGE}
                                alt={`Avatar de ${store.user.name}`}
                                className="profile-avatar"
                            />

                            <div className="profile-user-summary">
                                <h2>{store.user.name}</h2>
                                <p>{store.user.code}</p>
                            </div>

                            <div className="profile-user-details">
                                <div>
                                    <span>FC</span>
                                    <strong>{store.user.fc || "-"}</strong>
                                </div>
                            </div>
                        </aside>

                        <section className="profile-favorites-card">
                            <div className="profile-favorites-header">
                                <div>
                                    <h2>Mis favoritos</h2>
                                    <p>Haz clic en una actividad para ver su descripción</p>
                                </div>
                                <span className="profile-favorites-count">{favoriteActivities.length}</span>
                            </div>

                            {loading ? <p className="profile-message">Cargando favoritos...</p> : null}
                            {error ? <p className="profile-message profile-error">{error}</p> : null}
                            {favoriteFeedback ? (
                                <p className={`profile-message ${favoriteFeedback.type === "error" ? "profile-error" : "profile-success"}`}>
                                    {favoriteFeedback.text}
                                </p>
                            ) : null}

                            {!loading && !error ? (
                                favoriteActivities.length > 0 ? (
                                    <>
                                        <div className="profile-favorites-list-wrapper">
                                            <table className="profile-favorites-list">
                                                <thead>
                                                    <tr>
                                                        <th>Código</th>
                                                        <th>Nombre</th>
                                                        <th>Categoría</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {favoriteActivities.map((activity) => (
                                                        <tr
                                                            key={activity.id}
                                                            className={`profile-favorite-row${selectedActivity?.id === activity.id ? " profile-favorite-row-active" : ""}`}
                                                            onClick={() => setSelectedActivity(activity)}
                                                            onKeyDown={(event) => handleRowKeyDown(event, activity)}
                                                            tabIndex={0}
                                                        >
                                                            <td>{activity.code}</td>
                                                            <td>{activity.name}</td>
                                                            <td>{formatLabel(activity.category)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>


                                    </>
                                ) : (
                                    <div className="profile-empty-favorites">
                                        <p>Todavía no has guardado actividad en favoritos.</p>
                                        <Link to="/activities" className="profile-button">
                                            Explorar actividades
                                        </Link>
                                    </div>
                                )
                            ) : null}
                        </section>
                    </div>
                </div>
            </div>

            <ActivityModal
                activity={selectedActivity}
                imageUrl={selectedActivity ? CATEGORY_IMAGES[selectedActivity.category?.toString().trim().toLowerCase()] : undefined}
                badgeLabel={selectedActivity ? formatLabel(selectedActivity.category) : ""}
                onClose={() => setSelectedActivity(null)}
                titleId="profile-activity-detail-title"
                actionsClassName="profile-modal-actions"
                actions={selectedActivity ? (
                    <>
                        <button
                            type="button"
                            className="activity-favorite-button activity-favorite-button-modal is-active"
                            onClick={() => confirmRemoveFavorite(selectedActivity)}
                            disabled={favoritePendingId === selectedActivity.id}
                        >
                            {favoritePendingId === selectedActivity.id
                                ? "Actualizando..."
                                : "♥ Quitar de favoritos"}
                        </button>

                        <Link
                            to={getCategoryRoute(selectedActivity.category)}
                            className="profile-link-button"
                            onClick={() => setSelectedActivity(null)}
                        >
                            Ver categoría
                        </Link>
                    </>
                ) : null}
            />
        </div>
    );
};
