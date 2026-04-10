import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const Drabbles = () => (
    <ActivityCategoryPage
        title="Drabbles"
        categoryValue="drabbles"
        badgeNote="10 Pts."
        description={
            <>
                Un Drabble, también llamado microrrelato, es una obra literaria breve que se distingue por su concisión y precisión, limitada generalmente a un número fijo de palabras. A pesar de su brevedad, contiene todos los elementos esenciales de una narrativa tradicional: una introducción, un desarrollo que plantea el conflicto o la idea central, y un desenlace que cierra la historia de manera impactante y memorable. Es un ejercicio de síntesis que desafía al autor a decir mucho con muy poco.
                <br />
                <br />
                Nosotros trabajaremos con <strong>100 y 200 palabras exactas</strong>. Queda en ustedes cuál formato usar.
                <br />
                <br />
                <strong>Contador de palabras online</strong> utilizado por la administración para revisar drabbles:
                <br />
                <a
                    href="https://www.contadordepalabras.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    https://www.contadordepalabras.com/
                </a>
            </>
        }
    />
);

