import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const IndexPage = () => {
    const [logs, setLogs] = useState([]);
    const [searching, setSearching] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Inicializa a conexão com o servidor para receber o stream
        const socketConnection = io('http://localhost:3000'); // Substitua pelo endereço do seu servidor
        setSocket(socketConnection);

        // Escuta o evento 'screenShare' para receber o stream do aluno
        socketConnection.on('screenShare', (stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            document.body.appendChild(video);
        });

        return () => {
            socketConnection.disconnect();
        };
    }, []);

    const startSearching = () => {
        if (socket) {
            setSearching(true);
            setLogs((prev) => [...prev, 'Procurando compartilhamento na rede...']);
            socket.emit('startSearching'); // Notifica o servidor para iniciar a busca
        }
    };

    const stopSearching = () => {
        if (socket) {
            setSearching(false);
            setLogs((prev) => [...prev, 'Busca interrompida.']);
            socket.emit('stopSearching'); // Notifica o servidor para parar a busca
        }
    };

    return (
        <div>
            <h1>Aplicação do Instrutor</h1>
            <button onClick={searching ? stopSearching : startSearching}>
                {searching ? 'Interromper Busca' : 'Iniciar Busca'}
            </button>
            <div>
                {logs.map((log, index) => (
                    <p key={index}>{log}</p>
                ))}
            </div>
        </div>
    );
};

export default IndexPage;
