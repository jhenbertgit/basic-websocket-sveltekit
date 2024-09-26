<script lang="ts">
	import io from 'socket.io-client';

	$: msg = 'hello from client';

	const socket = io();

	socket.on('eventFromServer', (msg: any) => {
		console.log(msg);
	});

	$: {
		socket.emit('fromClient', msg);
	}
</script>

<div class="container mx-auto p-6">Websocket in SvelteKit</div>
