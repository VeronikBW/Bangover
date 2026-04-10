import { Link } from "react-router-dom";
import "../styles/pages/Activities.css";

const categories = [
    {
        name: "Drabbles",
        path: "/activities/drabbles",
        description: "Historias cortas y creatividad concentrada.",
    },
    {
        name: "Non Sex",
        path: "/activities/non-sex",
        description: "Contenido sugerente sin enfoque explícito.",
    },
    {
        name: "Quotes",
        path: "/activities/quotes",
        description: "Frases, citas e inspiración compartida.",
    },
    {
        name: "Sensible Content",
        path: "/activities/sensible-content",
        description: "Material sensible tratado con cuidado.",
    },
    {
        name: "Explicit",
        path: "/activities/explicit",
        description: "Publicaciones de contenido explícito para adultos.",
    },
    {
        name: "Agnus Dei",
        path: "/activities/agnus-dei",
        description: "Dinámicas y publicaciones de Agnus Dei.",
    },
    {
        name: "Special",
        path: "/activities/special",
        description: "Eventos, retos y entregas especiales.",
    },
    {
        name: "Recordis",
        path: "/activities/recordis",
        description: "Recuerdos y recopilaciones destacadas.",
    },
];

export const Activities = () => {
    return (
        <div className="activities-body">
            <div className="activities-wrapper">
                <div className="activities-card">
                    <div className="activities-header">
                        <h1>Categorías de actividades</h1>
                    </div>

                    <div className="activities-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.path}
                                to={category.path}
                                className="activity-category-link"
                            >
                                <span className="activity-category-name">{category.name}</span>
                                <span className="activity-category-description">
                                    {category.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};