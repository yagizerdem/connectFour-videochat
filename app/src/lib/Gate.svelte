<script>
  import SD from "./SD";
  import Spinner from "./Spinner.svelte";
  export let socket;
    export let appState;

    let username;

    function serchMatch(){
        if(!socket) return
        socket.emit("searchMatch" ,{username}) 
    }



</script>



<div class="gate">
    <h1>connect four</h1>
    <hr>
    <br/>
    <div class="is-active">
        {#if appState *1 === SD.appStates.home *1}
        <input type="text" placeholder="enter user name" bind:value={username}>
        <button on:click="{serchMatch}">search match</button>
        {/if}

        {#if appState *1 == SD.appStates.searchMatch *1}
                    <Spinner/>
                    <div>seraching for match ...</div>
                    <button on:click={()=>{
                        window.location.reload()
                    }}>cancel</button>
            {/if}
    </div>
</div>


<style>
    .gate{
        width: 300px;
        height: 300px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
        border-radius: 10px;
        position:absolute;
        top:50%;
        left:50%;
        margin-top:-150px;
        margin-left: -150px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
    }
    h1{
        font-size: 25px;
    }
    hr{
       height: 1px;
        width: 80%;
        display: block;
        margin:0 auto;
   }
   .is-active{
        display: flex;
        flex-direction: column;
        margin-top: 70px;
        align-items: center;
    }
    .is-active > button{
        width: 100px;
        display: block;
        margin:20px auto;
        cursor: pointer;
    }
    .is-active > input{
        margin:auto;
        padding: 6px 20px;
        display: block;
    }
</style>