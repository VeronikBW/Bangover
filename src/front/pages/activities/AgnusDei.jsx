import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const AgnusDei = () => {
    return (
        <div className="activity-category-page agnus-dei-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Agnus Dei</h1>
                <p>
                    Aquí podrás reunir y mostrar el contenido relacionado con la categoría
                    Agnus Dei de forma ordenada.
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