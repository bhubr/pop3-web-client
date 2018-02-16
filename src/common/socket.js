import io from 'socket.io-client';

const protocol = typeof window !== 'undefined' && window.__protocol ? window.__protocol : 'http';
export default io(protocol + '://localhost:3000');
