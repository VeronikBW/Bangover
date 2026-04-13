import { Link } from "react-router-dom";
import "../styles/pages/AdminTools.css";

const categories = [
    { name: "Drabbles", slug: "drabbles" },
    { name: "Non Sex", slug: "non-sex" },
    { name: "Quotes", slug: "quotes" },
    { name: "Sensible Content", slug: "sensible-content" },
    { name: "Explicit", slug: "explicit" },
    { name: "Agnus Dei", slug: "agnus-dei" },
    { name: "Special", slug: "special" },
    { name: "Recordis", slug: "recordis" },
    { name: "Gallery", slug: "gallery" },
    { name: "Music", slug: "music" },
];

export const AdminActivitiesList = () => {
    return (
        <div className="admin-tools-body">
            <div className="admin-tools-wrapper">
                <section className="admin-tools-card">
                    <h1>Lista de actividades por categoría</h1>
                    <p>
                        Categorías separadas para acceder rápido al contenido. Luego podemos agregar conteos,
                        filtros y acciones de edición por actividad.
                    </p>

                    <div className="admin-tools-category-grid">
                        {categories.map((category) => (
                            <Link key={category.slug} to={`/admin/activities/${category.slug}`} className="admin-tools-category-link">
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    <div className="admin-tools-actions">
                        <Link to="/admin" className="admin-tools-action-link">Volver al dashboard</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};
