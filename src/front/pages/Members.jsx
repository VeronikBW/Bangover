import "../styles/pages/Members.css";
import { useEffect, useMemo, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortedMembers = useMemo(() => {
    return [...members].sort((firstMember, secondMember) => {
      const firstName = (firstMember.name || "").toLowerCase();
      const secondName = (secondMember.name || "").toLowerCase();
      return firstName.localeCompare(secondName, "es");
    });
  }, [members]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/users`);

        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de miembros");
        }

        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error("Error loading members:", err);
        setError("No se pudo cargar la lista de miembros.");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  return (
    <div className="members-body">
      <div className="members-card-wrapper">
        <div className="members-card">
          <div className="members-header">
            <h1>Miembros registrados</h1>
            <p>Consulta el nombre y FC de cada usuario registrado en Bangover.</p>
          </div>

          {!loading && !error ? (
            <div className="members-summary">
              <span className="members-count">
                {members.length} miembro{members.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : null}

          {loading ? <p className="members-message">Cargando miembros...</p> : null}
          {error ? <p className="members-message members-error">{error}</p> : null}

          {!loading && !error ? (
            members.length > 0 ? (
              <div className="members-table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>FC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMembers.map((member) => (
                      <tr key={member.id}>
                        <td>{member.code}</td>
                        <td>{member.name}</td>
                        <td>{member.fc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="members-message">Todavía no hay miembros registrados.</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

