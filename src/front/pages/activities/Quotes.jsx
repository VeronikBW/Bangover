import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const Quotes = () => (
    <ActivityCategoryPage
        title="Quotes"
        categoryValue="quotes"
        badgeNote="20 Pts."
        description={
            <>
                <strong>Libre interpretación.</strong>
                <br />
                <br />
                Colección de frases desprendidas de su origen, mayormente recopiladas de libros, con la intención de que encuentren un nuevo significado en los ojos de quien las lee. Cada línea está hecha para resonar en historias personales, para que cada lector les dé su propio contexto y sentido único.
                <br />
                <br />
                La extensión del texto es variable, con la única condición de que supere las <strong>200 palabras</strong>.
            </>
        }
    />
);