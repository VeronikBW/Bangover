import "../styles/pages/Members.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goToAboutUs = () => {
    navigate("/about-us");
  };

  const sortedMembers = useMemo(() => {
    return [...members]
      .filter((m) => m.role === "user")
      .sort((firstMember, secondMember) => {
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
        <div className="members-page-card">

          <div className="members-banner-frame">
            <img
              src="https://res.cloudinary.com/dzvcmydip/image/upload/v1776136936/Banner_face_claims_p4wg8a.jpg"
              alt="Banner Face Claims"
              className="members-banner-img"
            />
          </div>

          <div className="members-admin-card">
            <img
              src="https://res.cloudinary.com/dzvcmydip/image/upload/v1776136936/Picsart_26-04-10_09-59-34-711_tryn8o.png"
              alt="Saret Rogewood"
              className="members-admin-avatar"
            />
            <div className="members-admin-info">
              <span className="members-admin-name">Saret Rogewood</span>
              <span className="members-admin-role">Administradora</span>
            </div>
          </div>

          <div className="members-card">
            <div className="members-header">
              <h1>Miembros registrados</h1>
              <p>Consulta el nombre y FC de cada usuario registrado en Bangover.</p>
            </div>

            {!loading && !error ? (
              <div className="members-summary">
                <span className="members-count">
                  {sortedMembers.length} miembro{sortedMembers.length === 1 ? "" : "s"}
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

          <div className="members-banner-frame members-banner-frame-bottom">
            <img
              src="https://res.cloudinary.com/dzvcmydip/image/upload/v1776136937/Banner_ingresos_bshivb.jpg"
              alt="Banner Ingresos"
              className="members-banner-img"
            />
          </div>

          <div className="members-entry-card">
            <p className="members-entry-text">
              Si llegaste a este punto es porque te interesa formar parte de este lugar (y porque te acabas de cerciorar que tu FC se encuentra disponible, claro está), así que te pediremos que escribas para nosotros antes de ingresar.
            </p>
            <p className="members-entry-text">
              A continuación exponemos para ti cinco temas, escoge uno de ellos y enviálo junto a tu ficha de ingreso.
            </p>
            <p className="members-entry-text">
              Y como somos amantes de los detalles, te pedimos que tu escrito tenga una extensión superior a 500 palabras, con un límite de 1000 palabras. Puedes moverte a gusto entre ese rango, no más, ni menos. Añade la cantidad de palabras al finalizar tu escrito.
            </p>

            <ul className="members-entry-topics">
              <li>
                <p className="members-entry-topic-title">• Privación sensorial</p>
                <p className="members-entry-topic-body">Explorar la privación de sentidos de forma personal e íntima por primera vez. Relatar cómo nos afecta la limitación de uno o más sentidos. La agradable sorpresa (o desagradable en caso de no haber sido acordado previamente), la duda, el gusto o disgusto. Qué sentiste, qué hiciste, qué esperas. ¿Salió bien? ¿Salió mal?</p>
              </li>
              <li>
                <p className="members-entry-topic-title">• Voyerismo casual</p>
                <p className="members-entry-topic-body">Cuéntanos ese momento en el que te encontraste de casualidad con la oportunidad de presenciar una escena sexual. Ese momento en el podrías haber pasado de largo, pero decidiste no hacerlo. Decidiste quedarte y oberservar. ¿Qué viste? ¿Por qué te quedaste? ¿Permaneciste en las sombras o te descubrieron mirando?</p>
              </li>
              <li>
                <p className="members-entry-topic-title">• Descubriendo un fetiche</p>
                <p className="members-entry-topic-body">Dicen que jamás dejamos de aprender, y es verdad. En esta ocasión queremos que te expongas por primera vez a una práctica o indicio de ella. Algunos son capaces de rescatar ciertas señales desde muy jóvenes. Otros descubren ese gusto particular con un compañero de cama en circunstancias inusuales.</p>
              </li>
              <li>
                <p className="members-entry-topic-title">• Primera experiencia sexual</p>
                <p className="members-entry-topic-body">Todos llegan a ese momento de la vida que representa un quiebre en la inocencia. Donde se deja de ser un niño y se asimila la sexualidad, en el sentido crudo de la palabra. Este primer acto sexual, ¿fue en solitario o con un acompañante? ¿Fue realizado como un acto de amor? En caso del segundo, ¿con quién? ¿Qué características tuvo el encuentro? Puede haber sido suave, llenador, una experiencia única e inolvidable, positiva. O no, ¿fue consentido o no lo fue? Quizás existe ese recuerdo como algo que se desea olvidar.</p>
              </li>
              <li>
                <p className="members-entry-topic-title">• La intensidad ideal</p>
                <p className="members-entry-topic-body">A veces depende de nuestro estado de ánimo, o de nuestro estado mental. Podemos preferir sexo vainilla, lento y suave. Otras veces deseamos destrozar o ser destrozados, reducir al otro a un pequeño desastre, o entregarnos a aquel que se encarga de deshacernos por completo en el placer del dolor.<br />
                  ¿Cuál eres tú? Si alguna vez probaste lo contrario, ¿cómo fue? Quizás disfrutas de ambos. Quizás uno te aburre mientras el otro no. ¿Cuál es tu caso? ¿Cómo has sabido cuál te gusta, o que ambos son de tu gusto?</p>
              </li>
            </ul>

            <p className="members-entry-warning">
              No olvides enviar tu escrito junto a la ficha de ingreso, añadir la cantidad de palabras y, además, colocar a cuál título pertenece. Prescindir de esta información te hará perder el cupo.
            </p>
          </div>

          <div className="members-banner-frame members-banner-frame-bottom">
            <img
              src="https://res.cloudinary.com/dzvcmydip/image/upload/v1776136936/Banner_ficha_de_ingreso.jpg_evbxzr.jpg"
              alt="Banner Ficha de Ingreso"
              className="members-banner-img"
            />
          </div>

          <div className="members-ficha-card">
            <ul className="members-ficha-list">
              <li className="members-ficha-item">• Nombre:</li>
              <li className="members-ficha-item">• Código personal (creado por ti):</li>
              <li className="members-ficha-item">• FC principal y su ocupación (Si no es conocido, añade una red social):</li>
              <li className="members-ficha-item">• Edad:</li>
              <li className="members-ficha-item">• Link del perfil:</li>
              <li className="members-ficha-item">• Códigos ocultos en las reglas (3):</li>
              <li className="members-ficha-item">• ¿Quieres imagen de acontecimiento? En caso de querer, añade un link a la foto que más te guste.</li>
              <li className="members-ficha-item">• Prueba de escritura:</li>
            </ul>
          </div>

          <div className="members-banner-frame members-banner-frame-bottom">
            <img
              src="https://res.cloudinary.com/dzvcmydip/image/upload/v1776136937/Banner_grupos_lh10iy.jpg"
              alt="Banner Grupos"
              className="members-banner-img"
            />
          </div>

          <div className="members-grupos-card">
            <p className="members-entry-text">
              Una vez tu ficha tenga el visto bueno agrega a la administradora, coloca el proyecto como lugar de trabajo (visible) y pide ingreso a los grupos (2). En cada uno encontrarás una breve explicación del mismo e información de utilidad.
            </p>

            <ul className="members-grupos-list">
              <li className="members-grupos-item">
                • <a href="https://www.facebook.com/groups/1138236747718386?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="members-grupos-link">Advertisement</a>
              </li>
              <li className="members-grupos-item">
                • <a href="https://www.facebook.com/groups/1276383647143876?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="members-grupos-link">Onrol</a>
              </li>
            </ul>

            <p className="members-entry-warning">
              Tras ser aceptada tu ficha dispondrás de 12 horas para pedir los ingresos a los grupos, de lo contrario tu cupo será liberado.
            </p>
          </div>
          <div className="page-navigation-wrapper">
            <button type="button" className="btn btn-dark page-navigation-button" onClick={goToAboutUs}>
              Ir a About Us
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

