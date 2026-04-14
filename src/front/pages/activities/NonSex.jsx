import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const NonSex = () => (
    <ActivityCategoryPage
        title="Non Sex"
        categoryValue="non-sex"
        badgeNote="50 Pts."
        wordNote="Mínimo 500 palabras"
        description={
            <>
                Como indica el nombre de la categoría, se trata de actividades que se alejan de lo sexual, orientadas a la cotidianidad y al ámbito sentimental, poniendo el foco en las emociones, los vínculos y los pequeños momentos de la vida diaria.
                <br />
                <br />
                Si bien este es el enfoque principal, es posible incorporar una connotación sutil o secundaria, siempre que no desplace la esencia de la categoría.
            </>
        }
    />
);