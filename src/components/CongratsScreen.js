import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';

export const CongratsScreen = ({
    className,
    style,
    title,
    score,
    records,
    onDismiss: dismiss
}) => {
    const [petraResponse, setPetraResponse] = useState(null); // Estado para la respuesta de Petra
    const [isLoading, setIsLoading] = useState(false); // Estado para el loader

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(window.location.href);
    }

    const tweetText = encodeURI("I scored " + score + "% on a Geography Treasure Hunt in search of " + title + ". Try it yourself!");

    const connectPetra = async () => {
        const getAptosWallet = () => {
            if ('aptos' in window) {
                return window.aptos;
            } else {
                //window.open('https://petra.app/', `_blank`);
            }
        };

        const wallet = getAptosWallet();

        try {
            setIsLoading(true); // Iniciamos el loader
            const response = await wallet.connect();
            const account = await wallet.account();

            // Hacemos la llamada POST con el wallet y el score (percentage)
            const postData = {
                wallet: account.address,
                percentage: String(score)  // Aseguramos que percentage sea un string
            };

            // Realizamos la llamada POST
            const result = await fetch('http://127.0.0.1:8000/success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            // Manejo de la respuesta
            const resultData = await result.json();
            console.log('Success:', resultData);

            // Guardamos la respuesta en el estado y detenemos el loader
            setPetraResponse(resultData);
            setIsLoading(false);

        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false); // Detenemos el loader en caso de error
        }
    }

    className = className + " d-flex justify-content-center align-items-center";
    return (
        <div id="congrats" className={className} style={style}>
            <div id="inner"
                className="d-flex flex-column border bg-white ms-2 me-2 p-2"
                style={{ width: "95%", maxWidth: "600px", maxHeight: "95%" }}>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-close"
                        onClick={() => { dismiss() }}></button>
                </div>

                <div className="flex-grow-1 d-flex flex-column overflow-hidden p-2 m-0 m-sm-2 me-sm-1"
                    style={{ height: "100%" }}>
                    <h1 className="display-5 fw-bold text-center">You made it!</h1>
                    <p className="h5 text-center" style={{ fontWeight: 400 }}>You navigated the <strong>{title}</strong> Treasure Hunt!</p>
                    <h2 className="align-self-center display-1 fw-bold">{score}%</h2>

                    <ul className="list-group list-group-flush overflow-auto">
                        {
                            records.map(
                                (record) =>
                                    <li key={record.objectid} className="list-group-item d-flex align-items-center">
                                        <span className="flex-grow-1">{record.location_name}</span>
                                        <span>
                                            <i className={
                                                record.solved && !record.skipped ?
                                                    "bi-check text-success" :
                                                    "bi-x text-danger"
                                            }
                                                style={{ fontSize: "1.5rem" }}></i>
                                        </span>
                                        <span></span>
                                    </li>
                            )
                        }
                    </ul>

                    {/* Mostramos el loader si isLoading es true */}
                    {isLoading ? (
                        <div className="text-center my-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        // Si la respuesta de Petra no está, mostramos el botón
                        !petraResponse ? (
                            <button
                                className="btn btn-primary align-self-center my-3"
                                onClick={connectPetra}>
                                Connect Petra
                            </button>
                        ) : (
                            // Si ya tenemos la respuesta, mostramos la imagen y el texto de felicitaciones
                            <div className="text-center">
                                <img src={petraResponse.url} alt="Generated by AI" className="img-fluid" />
                                <p className="h5 mt-3">Congratulations! You've just earned an exclusive NFT generated with AI. Enjoy your unique digital treasure and thank you for participating in the Treasure Hunt! You can find it in your Petra wallet using the following hash: {petraResponse.token_hash} </p>
                            </div>
                        )
                    )}

                </div>
            </div>

        </div> /*intro*/
    );
}
