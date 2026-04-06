import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Music = () => {
    return (
        <div className="activity-category-page music-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Music</h1>
                <p>
                    Esta sección queda lista para recopilar playlists, piezas musicales y
                    recomendaciones sonoras de la comunidad.
                </p>
                <div className="activity-category-actions">
                    <Link to="/activities" className="activity-category-button">
                        Volver a actividades
                    </Link>
                </div>
            </div>
        </div>
    );
};