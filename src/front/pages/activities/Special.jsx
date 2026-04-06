import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Special = () => {
    return (
        <div className="activity-category-page special-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Special</h1>
                <p>
                    La sección Special queda preparada para eventos únicos, actividades
                    especiales y publicaciones destacadas.
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