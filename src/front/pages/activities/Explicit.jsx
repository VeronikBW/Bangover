import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";
export const Explicit = () => (
    <ActivityCategoryPage
        title="Explicit"
        categoryValue="explicit"
        badgeNote="50 Pts."
        wordNote="Mínimo 500 palabras"
        description={
            <>
                Como indica el nombre de la categoría, se trata de actividades que abordan lo sexual de manera directa, abierta y sin ambiguüedades, donde la explicitud define el tono general del espacio.
                <br />
                <br />
                Si bien este es el enfoque principal, también se permite —y se valora— la incorporación de elementos emocionales, narrativos o vinculares que aporten profundidad a las experiencias. En estos casos, lo explícito no necesita estar presente en todo momento, pero sí forma parte del marco que da identidad a la categoría.
            </>
        }
    />
);