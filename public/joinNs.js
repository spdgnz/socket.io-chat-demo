// we could ask the server for fresh info on this NS. BAD!!
// we have socket.io/ws, and the server will tell us when something has happened!

const joinNs = (element, nsData) => {
    // rimuove il bordo da tutti gli elementi
    document.querySelector('.namespaces').querySelectorAll('.namespace').forEach( ele => {
        ele.firstElementChild.classList.remove('active-namespace');
    })

    // aggiunge il bordo all'alemento selezionato
    element.querySelector('img').classList.add('active-namespace');


    // recupera le room(varie chat) dal namespace selezionato
    const nsEndpoint = element.getAttribute('ns');
    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint);
    const rooms = clickedNs.rooms;

    if(selectedNsId != clickedNs.id) {
        nameSpaceSockets[selectedNsId].emit('leaveNsRooms', selectedNsId);
        console.log('leaveRoomsEmesso', selectedNsId);
    }
    // global save the selected name space
    selectedNsId = clickedNs.id;

    // imposta il titolo nella GUI
    document.querySelector('.namespace-title').innerHTML = clickedNs.name;
    
    // clear-init current rooms
    let roomsList = document.querySelector('.room-list');
    roomsList.innerHTML = '';

    //draw namespace rooms
    rooms.forEach( room => {
        let icon = room.privateRoom ? 'lock' : 'globe';
        roomsList.innerHTML += `
        <li class="room" namespaceId=${room.namespaceId}>
            <span class="fa-solid fa-${icon}"></span>${room.roomTitle}
        </li>`;
    });

    //join the first room
    joinRoom(rooms[0].roomTitle, clickedNs.id);

    //add a click listener to each room so the client can tell the server it wants to join
    const roomNodes = document.querySelectorAll('.room');
    Array.from(roomNodes).forEach ( (elem) => {
        elem.addEventListener('click', e => {
            console.log('Clicked on', e.target.innerText);
            const namespaceId = elem.getAttribute('namespaceId');
            joinRoom(e.target.innerText, namespaceId);
        })
    });

}