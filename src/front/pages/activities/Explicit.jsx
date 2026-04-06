import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Explicit = () => {
    return (
        <div className="activity-category-page explicit-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Explicit</h1>
                <p>
                    Aquí se podrá centralizar el contenido explícito con una presentación
                    clara y separada del resto de categorías.
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