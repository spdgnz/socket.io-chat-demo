const joinRoom = async (roomTitle, namespaceId) => {
    document.querySelector('.curr-room-text').innerHTML = roomTitle;
    
    /* callback versione 1 > valore passato alla funzione */
    /*
    console.log(roomTitle, namespaceId);
    nameSpaceSockets[namespaceId].emit('joinRoom', roomTitle, (ackResp) => {

        //recupero dei room user tramite callback (inutilizzato)
        console.log('numUsers', ackResp.numUsers);
    });
    */


    /* callback versione 2 > valore passato alla variabile */
    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', {roomTitle, namespaceId});
    console.log('numUsers', ackResp.thisRoomHistory);

    document.querySelector('#messages').innerHTML = '';
    ackResp.thisRoomHistory.forEach( message  => {
        document.querySelector('#messages').innerHTML += buildMessageHtml(message);
    });
}