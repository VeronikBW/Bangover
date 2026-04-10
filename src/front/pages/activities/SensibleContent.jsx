import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const SensibleContent = () => (
    <ActivityCategoryPage
        title="Sensible Content"
        categoryValue="sensible-content"
        badgeNote="40 Pts."
        description={
            <>
                Es posible que los títulos no sean del agrado común; por ello, se solicita respeto hacia quienes decidan escribir sobre estos temas, así como también hacia los autores, quienes deberán ser cuidadosos en la elección del lenguaje utilizado.
                <br />
                <br />
                Se recomienda incluir las advertencias pertinentes, tales como <strong>“+18”</strong> o <strong>“+21”</strong>, según corresponda.
                <br />
                <br />
                La extensión del texto es variable, con la única condición de que supere las <strong>500 palabras</strong>.
            </>
        }
    />
);