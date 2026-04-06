import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Recordis = () => {
    return (
        <div className="activity-category-page recordis-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Recordis</h1>
                <p>
                    Esta categoría puede servir para conservar recuerdos, compilaciones y
                    momentos destacados de la comunidad.
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