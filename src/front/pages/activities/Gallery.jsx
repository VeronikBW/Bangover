import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Gallery = () => {
    return (
        <div className="activity-category-page gallery-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Gallery</h1>
                <p>
                    La galería permitirá agrupar imágenes, piezas visuales y contenido
                    artístico en un mismo lugar.
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