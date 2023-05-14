import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(morgan('combined'));

app.get('/', async (req, res) => {
  res.json({ hello: 'people' });
});

// const port = Number(process.env.PORT ?? 8080);
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// Socket.IO
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.join('main_room');

  // Receive payload from client page
  socket.on('send_message', (data) => {
    // console.log(data, 'payload');
    console.log('socket.id :', socket.id);
    // Send payload to dashboard page
    socket.to('main_room').emit('receive_message', data);
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});
