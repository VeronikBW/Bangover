import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const Quotes = () => {
    return (
        <div className="activity-category-page quotes-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Quotes</h1>
                <p>
                    Un espacio para frases memorables, citas favoritas y pequeños textos
                    inspiradores dentro de Bangover.
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