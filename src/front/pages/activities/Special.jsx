import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

const specialSubcategoryGroups = [
    {
        value: "omegaverse",
        label: "Omegaverse",
        badgeNote: "50 Pts.",
        wordNote: "Mínimo 500 palabras",
        description: (
            <>
                Omegaverse, también conocido como A/B/O, es un subgénero de la ficción erótica especulativa, que originalmente era un subgénero del fan fiction <em>slash</em> erótico.
            </>
        ),
    },
    {
        value: "anais-nin",
        label: "Anaïs Nin",
        badgeNote: "50 Pts.",
        wordNote: "Mínimo 500 palabras",
        description: (
            <>
                Anaïs Nin no escribía sobre el sexo. Escribía sobre el deseo, sobre la espera, sobre la mente que imagina antes de que el cuerpo actúe. En su obra, el erotismo no es un fin, sino una puerta: hacia el yo, hacia el otro, hacia lo que se reprime y lo que se libera.
                <br />
                <br />
                Recopilación de ideas (inspiradas o textuales) de las obras de Anais Nin, una mujer que nos presenta —más allá del erotismo explícito—, la libertad de las mujeres para desear: con hambre, con culpa, con poder.
            </>
        ),
    },
    {
        value: "circulo-de-los-celos",
        label: "Círculo de los celos",
        badgeNote: "50 Pts.",
        wordNote: "Mínimo 300 palabras",
        description: (
            <>
                Pueden aparecer como un simple destello de inseguridad o crecer hasta convertirse en una fuerza devastadora que destruye todo lo que tiene al alcance. No son lineales: se despliegan en capas, en descensos, como si el corazón, o la mente, atravesara distintos umbrales.
                <br />
                <br />
                Inspirados en la idea de los círculos del infierno, se proponen siete círculos de los celos: cada uno es más profundo y oscuro que el anterior. Desde el primer murmullo, casi imperceptible, hasta la ruina final, donde el amor se diluye a tal nivel que solo queda la destrucción.
            </>
        ),
    },
    {
        value: "nos-pueden-ver",
        label: "¡Nos pueden ver!",
        badgeNote: "50 Pts.",
        wordNote: "Mínimo 300 palabras",
        description: (
            <>
                Un “rapidin” no es solo sexo breve: es la urgencia, la falta de control, el riesgo de ser descubiertos. Es la imposibilidad de prolongar el deseo y, a la vez, la necesidad de condensarlo en un instante que parece quemarte por dentro. La prisa, el peligro, la tensión y la excitación son los verdaderos protagonistas en estos encuentros.
            </>
        ),
    },
];

export const Special = () => (
    <ActivityCategoryPage
        title="Special"
        categoryValue="special"
        subcategoryGroups={specialSubcategoryGroups}
    />
);