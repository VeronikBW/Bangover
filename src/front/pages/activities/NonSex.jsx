import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const NonSex = () => (
    <ActivityCategoryPage
        title="Non Sex"
        categoryValue="non-sex"
        badgeNote="50 Pts."
        description={
            <>
                Como indica el nombre de la categoría, se trata de actividades que se alejan de lo sexual, orientadas principalmente a la cotidianidad y/o al ámbito sentimental. Este espacio busca dar cabida a experiencias más simples o íntimas, centradas en las emociones, los vínculos y los pequeños momentos que forman parte de la vida diaria.
                <br />
                <br />
                Si bien el enfoque no es sexual, es posible otorgarles esa connotación de manera sutil o secundaria, siempre que no desplace el carácter principal de la categoría.
                <br />
                <br />
                <strong>Debe superar las 500 palabras.</strong>
            </>
        }
    />
);