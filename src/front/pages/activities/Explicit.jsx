import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const Explicit = () => (
    <ActivityCategoryPage
        title="Explicit"
        categoryValue="explicit"
        badgeNote="50 Pts."
        description={
            <>
                En esta categoría, se presenta un concepto relacionado con una práctica específica y/o su definición, principalmente de carácter sexual.
                <br />
                <br />
                La extensión del texto es variable; la única condición es que supere las <strong>500 palabras</strong>. Por lo tanto, se valoran los detalles y la profundidad en el desarrollo del tema.
            </>
        }
    />
);