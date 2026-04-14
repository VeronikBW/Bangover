import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const AgnusDei = () => (
    <ActivityCategoryPage
        title="Agnus Dei"
        categoryValue="agnus-dei"
        badgeNote="50 Pts."
        wordNote="Mínimo 500 palabras"
        description={
            <>
                <strong>Religión:</strong> Conjunto de creencias religiosas, de normas de comportamiento y de ceremonias de oración o sacrificio que son propias de un determinado grupo humano y con las que el hombre reconoce una relación con la divinidad (un dios o varios dioses).
                <br />
                <br />
                En esta categoría se reúnen actividades relacionadas con estas creencias. El enfoque queda abierto, permitiendo tanto la exploración como la reinterpretación de las normas que las rodean.
                <br />
                <br />
                Dado que puede tratarse de un tema sensible para muchas personas, se recomienda el uso de advertencias pertinentes al momento de publicar.
            </>
        }
    />
);