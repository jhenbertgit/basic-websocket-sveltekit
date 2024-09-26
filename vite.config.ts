import { sveltekit } from '@sveltejs/kit/vite';
import { type ViteDevServer, defineConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import type { KIT_ROUTES } from '$lib/ROUTES';
import { Server } from 'socket.io';

//development
const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello from server!');
			
			socket.on('fromClient', (msg) => {
				console.log(msg);
			});
		});
	}
};

export default defineConfig({
	plugins: [
		sveltekit(),
		webSocketServer,
		kitRoutes<KIT_ROUTES>({ LINKS: { blog: 'https://blog.bytemindsph.com' } })
	]
});
