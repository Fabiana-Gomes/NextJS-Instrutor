const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Importar o pacote cors

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    
 // Adicionar CORS para as requisições HTTP do Express
 server.use(cors({
    origin: '*', // Permitir origem do cliente
    methods: ['GET', 'POST'],
    credentials: true
}));

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3001', // Permitir origem do cliente (máquina do aluno)
        methods: ['GET', 'POST'],
        credentials: true
    }
});
    io.on('connection', (socket) => {
        console.log('Novo instrutor conectado'); // Log modificado

        socket.on('startSearching', () => {
            console.log('Iniciando busca...');
            // Lógica para iniciar busca
        });

        socket.on('stopSearching', () => {
            console.log('Busca interrompida.');
            // Lógica para interromper busca
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`Servidor ouvindo na porta ${port}`);
    });
});
