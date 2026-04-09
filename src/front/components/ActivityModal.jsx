import { useEffect } from "react";
import "../styles/pages/activities/ActivityCategory.css";

export const ActivityModal = ({
    activity,
    imageUrl,
    badgeLabel,
    onClose,
    actions,
    actionsClassName = "activity-detail-actions activity-detail-actions-bottom",
    titleId = "activity-detail-title",
    descriptionFallback = "Esta actividad todavía no tiene descripción disponible.",
}) => {
    useEffect(() => {
        if (!activity) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [activity, onClose]);

    if (!activity) return null;

    const resolvedImage = imageUrl || activity.image;

    return (
        <div className="activity-modal-overlay" onClick={onClose}>
            <div
                className="card activity-detail-card activity-detail-modal border-0"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <button
                    type="button"
                    className="activity-detail-close"
                    onClick={onClose}
                    aria-label="Cerrar ficha"
                >
                    ×
                </button>

                <div className="activity-detail-layout">
                    <div className="activity-detail-media">
                        {resolvedImage ? (
                            <img
                                src={resolvedImage}
                                className="card-img-top activity-detail-image"
                                alt={activity.name}
                            />
                        ) : (
                            <div className="activity-detail-image activity-detail-image-placeholder">
                                Imagen no disponible
                            </div>
                        )}
                    </div>

                    <div className="card-body activity-detail-content">
                        <div className="activity-detail-meta">
                            {badgeLabel ? <span className="activity-detail-chip">{badgeLabel}</span> : null}
                            <span className="activity-detail-chip activity-detail-chip-code">
                                Código: {activity.code}
                            </span>
                        </div>

                        <h2 id={titleId} className="card-title">
                            {activity.name}
                        </h2>
                        <p className="card-text">
                            {activity.description || descriptionFallback}
                        </p>

                        {actions ? <div className={actionsClassName}>{actions}</div> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};