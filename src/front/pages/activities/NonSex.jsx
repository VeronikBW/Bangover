import { Link } from "react-router-dom";
import "../../styles/pages/activities/ActivityCategory.css";

export const NonSex = () => {
    return (
        <div className="activity-category-page non-sex-page">
            <div className="activity-category-card">
                <span className="activity-category-badge">Bangover · Categoría</span>
                <h1>Non Sex</h1>
                <p>
                    Aquí podrás organizar el contenido sugerente o romántico sin entrar en
                    material explícito.
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