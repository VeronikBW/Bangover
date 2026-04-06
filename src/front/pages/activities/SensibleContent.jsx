import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const SensibleContent = () => {
    return (
        <div className="activity-category-page sensible-content-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Sensible Content</h1>
                <p>
                    Esta vista deja lista la sección destinada al contenido sensible, con
                    una presentación separada y fácil de ubicar.
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