import { Link } from "react-router-dom";
import "../styles/pages/AdminDashboard.css";

const adminActions = [
    {
        label: "Registrar usuarios",
        to: "/admin/users/new",
        description: "Crear nuevos perfiles para el equipo y asignar datos iniciales.",
    },
    {
        label: "Lista de usuarios",
        to: "/admin/users",
        description: "Consultar usuarios existentes y su estado actual en el sistema.",
    },
    {
        label: "Registrar actividades",
        to: "/admin/activities/new",
        description: "Agregar nuevas actividades con su categoría y contenido asociado.",
    },
    {
        label: "Lista de actividades",
        to: "/admin/activities",
        description: "Revisar actividades organizadas por categorías para gestionar mejor.",
    },
];

export const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-body">
            <div className="admin-dashboard-wrapper">
                <section className="admin-dashboard-card">
                    <header className="admin-dashboard-header">
                        <span className="admin-dashboard-badge">Panel Administrativo</span>
                        <h1>Gestión general</h1>
                        <p>Accede a las herramientas principales para administrar usuarios y actividades.</p>
                    </header>

                    <div className="admin-dashboard-grid">
                        {adminActions.map((action) => (
                            <Link key={action.to} to={action.to} className="admin-dashboard-link">
                                <span className="admin-dashboard-link-title">{action.label}</span>
                                <span className="admin-dashboard-link-description">{action.description}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
