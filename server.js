const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

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
