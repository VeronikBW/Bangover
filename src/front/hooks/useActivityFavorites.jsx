import { useMemo, useState } from "react";
import useGlobalReducer from "./useGlobalReducer";

export const useActivityFavorites = ({
    backendUrl = "",
    authMessage = "Inicia sesión para gestionar tus favoritos.",
    onSuccess,
    onError,
} = {}) => {
    const { store, dispatch } = useGlobalReducer();
    const [favoritePendingId, setFavoritePendingId] = useState(null);
    const [favoriteFeedback, setFavoriteFeedback] = useState(null);

    const favoritesByActivityId = useMemo(() => {
        return (store.favorities || []).reduce((favoritesMap, favorite) => {
            favoritesMap.set(Number(favorite.activity_id), favorite);
            return favoritesMap;
        }, new Map());
    }, [store.favorities]);

    const emitFeedback = (type, text) => {
        setFavoriteFeedback({ type, text });

        if (type === "error") {
            onError?.(text);
            return;
        }

        onSuccess?.(text);
    };

    const isFavorite = (activityId) => favoritesByActivityId.has(Number(activityId));

    const toggleFavorite = async (activity) => {
        if (!store.token) {
            emitFeedback("error", authMessage);
            return;
        }

        const existingFavorite = favoritesByActivityId.get(Number(activity.id));
        setFavoritePendingId(activity.id);
        setFavoriteFeedback(null);

        try {
            const response = await fetch(
                existingFavorite
                    ? `${backendUrl}/api/favorites/${existingFavorite.id}`
                    : `${backendUrl}/api/favorites`,
                {
                    method: existingFavorite ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                        ...(existingFavorite ? {} : { "Content-Type": "application/json" }),
                    },
                    ...(existingFavorite
                        ? {}
                        : { body: JSON.stringify({ activity_id: activity.id }) }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || data.message || "No se pudo actualizar favoritos.");
            }

            if (existingFavorite) {
                dispatch({ type: "remove_favorite", payload: existingFavorite.id });
                emitFeedback("success", `${activity.name} se eliminó de tus favoritos.`);
            } else {
                dispatch({ type: "add_favorite", payload: data });
                emitFeedback("success", `${activity.name} se guardó en tus favoritos.`);
            }
        } catch (favoriteError) {
            console.error("Error updating favorites:", favoriteError);
            emitFeedback("error", favoriteError.message || "No se pudo actualizar favoritos.");
        } finally {
            setFavoritePendingId(null);
        }
    };

    const removeFavorite = async (activity) => {
        if (!store.token) {
            emitFeedback("error", authMessage);
            return;
        }

        const existingFavorite = favoritesByActivityId.get(Number(activity.id));

        if (!existingFavorite) {
            emitFeedback("error", "Esta actividad ya no está en tus favoritos.");
            return;
        }

        setFavoritePendingId(activity.id);
        setFavoriteFeedback(null);

        try {
            const response = await fetch(`${backendUrl}/api/favorites/${existingFavorite.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${store.token}`,
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || data.message || "No se pudo quitar de favoritos.");
            }

            dispatch({ type: "remove_favorite", payload: existingFavorite.id });
            emitFeedback("success", `${activity.name} se eliminó de tus favoritos.`);
        } catch (favoriteError) {
            console.error("Error removing favorite:", favoriteError);
            emitFeedback("error", favoriteError.message || "No se pudo quitar de favoritos.");
        } finally {
            setFavoritePendingId(null);
        }
    };

    return {
        token: store.token,
        favoritePendingId,
        favoriteFeedback,
        favoritesByActivityId,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        setFavoriteFeedback,
    };
};