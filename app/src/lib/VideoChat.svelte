<script>
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import Daily from '@daily-co/daily-js';
  
    export let roomid = null;
    let iframe;
    let call;
    // Use reactive statements to react to changes in roomid
    
    $: 
      if (iframe && roomid) {
        // Cleanup previous call if necessary
        if (call) {
          call.leave(); // or any appropriate cleanup method
        }
        // Wrap the iframe and join the call
        call = Daily.wrap(iframe);


        
// Function to check and request camera and microphone permissions
async function checkPermissions() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log('Camera and microphone access granted');
  } catch (error) {
    console.error('Camera and microphone access denied:', error);
  }
}

// Call the function before joining the meeting
checkPermissions().then(() => {
  // Join the meeting
  call.join({
    url: `https://testcall123.daily.co/${roomid}`
  })
  .then(() => {
    console.log('Joined the meeting successfully');
  })
  .catch(error => {
    console.error('Error joining the meeting:', error);
  });
});
      }
    

    // Optional: Cleanup on component destroy
    onDestroy(() => {
      if (call) {
        call.leave(); // or any appropriate cleanup method
      }
    });
  </script>
  
  <div class="video-chat-container">
    <iframe id="video-chat-frame" title="video chat" bind:this={iframe}></iframe>
  </div>
  
  <style>
    /* Your styles here */
    div{
        width: 300px;
        height: 400px;
        margin-left: 100px;
    }
    iframe{
        display: block;
        width: 100%;
        height: 100%;
    }
  </style>
  