import io from 'socket.io-client';

// const protocol = typeof window !== 'undefined' && window.__protocol ? window.__protocol : 'http';
const host = typeof window === 'undefined' ? 'http://localhost' :
  window.location.origin;

export default io(host);
