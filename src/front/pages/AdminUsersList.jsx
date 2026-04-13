import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import "../styles/pages/AdminTools.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

export const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        code: "",
        fc: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const sortedUsers = useMemo(() => {
        return [...users].sort((firstUser, secondUser) => {
            const firstName = (firstUser.name || "").toLowerCase();
            const secondName = (secondUser.name || "").toLowerCase();
            return firstName.localeCompare(secondName, "es");
        });
    }, [users]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return sortedUsers;
        return sortedUsers.filter(
            (user) =>
                (user.code || "").toLowerCase().includes(query) ||
                (user.name || "").toLowerCase().includes(query),
        );
    }, [sortedUsers, searchQuery]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await fetch(`${backendUrl}/api/users`);
                const data = await response.json().catch(() => []);

                if (!response.ok) {
                    throw new Error("No se pudo obtener la lista de usuarios.");
                }

                setUsers(Array.isArray(data) ? data : []);
            } catch (loadError) {
                console.error("Error loading users:", loadError);
                setError("No se pudo cargar la lista de usuarios.");
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const startEditing = (user) => {
        setEditingUserId(user.id);
        setEditForm({
            name: user.name || "",
            code: user.code || "",
            fc: user.fc || "",
        });
    };

    const cancelEditing = () => {
        setEditingUserId(null);
        setEditForm({ name: "", code: "", fc: "" });
    };

    const handleEditChange = ({ target }) => {
        setEditForm((previousState) => ({
            ...previousState,
            [target.name]: target.value,
        }));
    };

    const saveUser = async (userId) => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            const payload = {
                name: editForm.name.trim(),
                code: editForm.code.trim(),
                fc: editForm.fc.trim(),
            };

            const response = await fetch(`${backendUrl}/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage = data?.error || data?.message || "No se pudo modificar el usuario.";
                toast.error(errorMessage);
                return;
            }

            setUsers((previousUsers) =>
                previousUsers.map((user) => (user.id === userId ? { ...user, ...data } : user)),
            );
            toast.success("Usuario modificado correctamente.");
            cancelEditing();
        } catch (saveError) {
            console.error("Error updating user:", saveError);
            toast.error("Error de red al modificar usuario.");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = (user) => {
        toast.warning(`¿Eliminar a ${user.name}?`, {
            description: `Código: ${user.code}. Esta acción no se puede deshacer.`,
            duration: 6000,
            action: {
                label: "Eliminar",
                onClick: () => deleteUser(user.id, user.name),
            },
            cancel: {
                label: "Cancelar",
            },
        });
    };

    const deleteUser = async (userId, userName) => {
        try {
            const response = await fetch(`${backendUrl}/api/users/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                toast.error(data?.error || data?.message || "No se pudo eliminar el usuario.");
                return;
            }

            setUsers((previousUsers) => previousUsers.filter((user) => user.id !== userId));
            if (editingUserId === userId) cancelEditing();
            toast.success(`${userName} eliminado correctamente.`);
        } catch (deleteError) {
            console.error("Error deleting user:", deleteError);
            toast.error("Error de red al eliminar usuario.");
        }
    };

    return (
        <div className="admin-tools-body">
            <Toaster position="top-center" richColors />
            <div className="admin-tools-wrapper">
                <section className="admin-tools-card">
                    <h1>Lista de usuarios</h1>
                    <p>
                        Consulta usuarios registrados y modifica sus datos desde el botón de cada fila.
                    </p>

                    {isLoading ? <p className="admin-tools-message">Cargando usuarios...</p> : null}
                    {error ? <p className="admin-tools-message admin-tools-message-error">{error}</p> : null}

                    {!isLoading && !error ? (
                        <>
                            <div className="admin-tools-search">
                                <input
                                    type="search"
                                    placeholder="Buscar por código o nombre..."
                                    value={searchQuery}
                                    onChange={({ target }) => setSearchQuery(target.value)}
                                    className="admin-tools-search-input"
                                />
                                <span className="admin-tools-search-count">
                                    {filteredUsers.length} / {users.length}
                                </span>
                            </div>
                            <div className="admin-tools-table-wrapper">
                                <table className="admin-tools-table">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>FB</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => {
                                            const isEditing = editingUserId === user.id;

                                            return (
                                                <tr key={user.id}>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="code"
                                                                value={editForm.code}
                                                                onChange={handleEditChange}
                                                                className="admin-tools-table-input"
                                                                disabled={isSaving}
                                                            />
                                                        ) : (
                                                            user.code
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={editForm.name}
                                                                onChange={handleEditChange}
                                                                className="admin-tools-table-input"
                                                                disabled={isSaving}
                                                            />
                                                        ) : (
                                                            user.name
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="fc"
                                                                value={editForm.fc}
                                                                onChange={handleEditChange}
                                                                className="admin-tools-table-input"
                                                                disabled={isSaving}
                                                            />
                                                        ) : (
                                                            user.fc || "-"
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="admin-tools-table-actions">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-tools-mini-button"
                                                                        onClick={() => saveUser(user.id)}
                                                                        disabled={isSaving}
                                                                    >
                                                                        {isSaving ? "Guardando..." : "Guardar"}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-tools-mini-button is-secondary"
                                                                        onClick={cancelEditing}
                                                                        disabled={isSaving}
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-tools-mini-button"
                                                                        onClick={() => startEditing(user)}
                                                                    >
                                                                        Modificar
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-tools-mini-button is-danger"
                                                                        onClick={() => confirmDelete(user)}
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : null}

                    <div className="admin-tools-actions">
                        <Link to="/admin" className="admin-tools-action-link">Volver al dashboard</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};
