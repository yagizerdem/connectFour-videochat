<script>
     import { onMount, onDestroy } from 'svelte';
     import io from 'socket.io-client';
     import Gate from './lib/Gate.svelte';
     	import {notifications} from './lib/notification.js'
	import Toast from './lib/Toast.svelte'
  import SD from './lib/SD';
  import VideoChat from './lib/VideoChat.svelte';

  // variables
     let socket;
     var allChat = []
     let chatData = null
      let appState = SD.appStates.home
      let roomid = null
      let board = null
      let turn = false
    
    // let call = Daily.wrap(iframe);


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
        socket.on("info" ,(message)=>{
          notifications.info(message, 2000)
        })
        socket.on("appState" , (state)=>{
          appState = state
        })
        socket.on("chat" , (message) => {
          allChat = allChat.concat([message])
        })
        socket.on("roomid",(data)=>{
          roomid = data
        })
        socket.on("boardJson",(boardAsJson) =>{
          board = JSON.parse(boardAsJson)
          console.log(board , board[0][0] ,board[0][1], board[0][1]==null )
        })
        socket.on("turn",(data)=>{
          turn = data
          notifications.info(turn ? 'you are white player' : 'you are black player'  ,2000)
        })
      });

    // Cleanup on component destroy
    onDestroy(() => {
        if (socket) {
            socket.disconnect();
        }
    });

    function sendChat(){
      if(!chatData){
        notifications.danger("you chat box is empty", 2000)
        return
      }
      socket.emit("sendchat" , chatData)
      chatData = null
    }

    function onBoardClick(rowindex , colindex){
      socket.emit('move',{rowindex , colindex})
    }


</script>


{#if appState *1  !== 1}
  <Gate {socket} {appState}/>
{/if}

{#if appState *1  === 1}

<div class="wrapper">
  <div class="board">
    {#if board}
    {#each board as row , rowindex }
      {#each row as col , colindex}

      {#if board[rowindex][colindex] == SD.colors.white}
      <div class="circle white" on:click|preventDefault={()=>onBoardClick(rowindex , colindex)}></div>
    {/if}
    {#if board[rowindex][colindex] == SD.colors.black}
    <div class="circle black" on:click|preventDefault={()=>onBoardClick(rowindex , colindex)}></div>
  {/if}
      {#if board[rowindex][colindex] == null}
        <div class="circle" on:click|preventDefault={()=>onBoardClick(rowindex , colindex)}></div>
      {/if}
      {/each}
    {/each}
    {/if}

  </div>
  <div class="chat">
    <div class="screen">
      {#each allChat as data}
          <div class="message">{data}</div>
      {/each}

    </div>
    <input placeholder="you can caht" bind:value={chatData}/>
    <button on:click|preventDefault={sendChat}>send chat</button>
    <br>
    <button on:click={()=>{
      window.location.reload()
    }} class="levae">leave room</button>
  </div>
<VideoChat roomid={roomid}></VideoChat>

</div>
{/if}

<Toast  />

<style>
  .wrapper{
    width: fit-content;
    height: fit-content;
    padding: 50px;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50% , -50%);
    display: flex;
    align-items: center;

  }
  .board{
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

    width: 450px;
    height: 390px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    border: 10px solid black;
    background:#344C64 ;

  }
  .circle{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border:2px solid black;
    margin: 10px;
    cursor: pointer;
    background-color: #577B8D;
  }
  .chat{
    width: 230px;
    height: 380px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    margin-left: 50px;
    border-radius: 10px;
    background: #31363F;
  }
  .screen{
    width: 200px;
    height: 250px;
    background: white;
    margin:10px auto;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }
  .chat  input{
    border:none;
    outline:none;
    padding: 5px 10px;
    display: block;
    margin: 10px auto;
  }
  .chat  button{
    padding: 5px;
    width: 140px;
    display: block;
    margin: auto;
    border-radius: 4px;
    font-weight: bolder;
    cursor: pointer;
    outline: none;
    border: none;
    background: #424769;
    color:white;
}
.levae{
  margin-top: 20px;
}
.message{
    width: 90%;
    display: block;
    margin: 10px auto;
    background-color: 			#00FF00;
    word-break: break-all;
    padding: 5px 4px;
    border-radius: 4px;
    color:white;
    font-weight: bolder;
  }
  .white{
    background: white !important;
  }
  .black{
    background: black !important;
  }
</style>
