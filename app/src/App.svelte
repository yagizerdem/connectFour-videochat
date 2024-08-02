<script>
     import { onMount, onDestroy } from 'svelte';
     import io from 'socket.io-client';
     import Gate from './lib/Gate.svelte';
     	import {notifications} from './lib/notification.js'
	import Toast from './lib/Toast.svelte'
  import SD from './lib/SD';
  import app from './main';
     let socket;

      let appState = SD.appStates.home

       // Connect to the Socket.IO server
    onMount(() => {
        socket = io('http://localhost:3000',{ 
          autoConnect:false,
          transports: ["websocket"],
        }); // Replace with your server URL
        
        socket.connect()

        socket.on("error" , (message)=>{
          notifications.danger(message, 2000)
        })
        socket.on("appState" , (state)=>{
          appState = state
        })
      });

    // Cleanup on component destroy
    onDestroy(() => {
        if (socket) {
            socket.disconnect();
        }
    });


</script>


<Gate {socket} {appState}/>
<Toast  />

<style>
</style>
