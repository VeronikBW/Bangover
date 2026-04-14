import { ActivityCategoryPage } from "../../components/ActivityCategoryPage";

export const Recordis = () => (
    <ActivityCategoryPage
        title="Recordis"
        categoryValue="recordis"
        badgeNote="40 Pts."
        wordNote="Mínimo 400 palabras"
        description={
            <>
                “Recordar”, del latín <em>re-cordis</em>, significa literalmente “volver a pasar por el corazón”. Un concepto que invita a reflexionar sobre cómo los recuerdos no solo se alojan en la mente, sino que resuenan emocionalmente en lo más profundo de nosotros.
                <br />
                <br />
                Este espacio no es solo para describir: es también para revivir, detallar y explorar aquello que nos mueve y nos define.
            </>
        }
    />
);