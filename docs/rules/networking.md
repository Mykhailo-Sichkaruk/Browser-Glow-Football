# Networking rules

Explanations of how networking works in the game. Messages templates between players and server.

## GAME_UPDATE  

Every time the game updates, the server sends a message to all players.
Message itself is a JSON object with positions of ball and players.

<pre>
MessageName: GAME_UPDATE
Content: {
    timestamp: time of update (int),
       ball: {  
         x: x position (int),  
         y: y position (int),  
         },  
     players: {  
         playerID: {
             x: x position,  
             y: y position,
             team: true for Blue team, false for Red team,
        },  
     }  
 }  
 </pre>
