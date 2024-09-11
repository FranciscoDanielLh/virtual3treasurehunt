export const Intro = ({
    className,
    style,
    title,
    description,
    hero,
    onDismiss: dismiss,
    backgroundImage,
    aptos
}) => {
    className = className + " d-flex justify-content-center align-items-center"
    return (
        <div id="intro"
            className={className}
            style={{
                ...style,
                textAlign: "center",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh", // Para que cubra toda la altura de la pantalla
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <div id="inner"
                className="d-flex flex-column-reverse flex-md-row h-100 w-100 justify-content-center align-items-center p-3 p-md-4">
                <div className="flex-grow-1 flex-shrink-0 d-flex flex-column overflow-hidden m-2 m-md-3"
                    style={{
                        maxWidth: "600px",
                        flexBasis: "50%",
                        backgroundColor: "rgba(255,255,255,0.8)", // Fondo semitransparente
                        padding: "20px", // Espaciado interno
                        borderRadius: "10px" // Bordes redondeados
                    }}>
                    <div className="overflow-auto">
                        <h1 className="display-3 fw-bold mb-3" style={{ fontSize: "30px" }}>{title}</h1>
                        <h2 className="" style={{ fontFamily: "Literata", fontWeight: 300, fontSize: "18px" }}>{description}</h2>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p> Featured: </p>
                        <img src={aptos} style={{ Height: "40px", minHeight: "40px", maxHeight: "40px", maxWidth: "40px" }}>
                        </img>
                    </div>

                    <div>
                        <button type="button"
                            className="btn btn-primary align-self-start mt-3 mt-md-5"
                            onClick={() => dismiss()}>Get started!</button>
                    </div>

                </div>
            </div>
        </div>
    );
}
