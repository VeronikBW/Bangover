import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Drabbles = () => {
    return (
        <div className="activity-category-page drabbles-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Drabbles</h1>
                <p>
                    Este espacio está pensado para los textos breves, ideas rápidas y
                    ejercicios creativos de la comunidad.
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

