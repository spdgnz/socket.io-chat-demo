const userName = prompt('Enter your username:');

const clientOptions = {
    auth: {
        userName,
    }
}

// always join the main namespace, because that's where the client gets the server namespaces from
const socket = io('http://localhost:9000', clientOptions);

//sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];

const listeners = {
    nsChange: [],
    numUsers: [],
    messageToRoom: [],
}

// stores the selected namespace (redux like)
let selectedNsId = 0;

//add a submit handler for our form
document.querySelector('#message-form').addEventListener('submit', e => {
    e.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    document.querySelector('#user-message').value = '';
    console.log('msg da inviare:', newMessage, 'ns:',selectedNsId);
    nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
        newMessage,
        date: Date.now(),
        userName,
        selectedNsId
    })
});

// manage all listeners added to all namespaces
const addListeners = (nsId) => {
    if(!listeners.nsChange[nsId]){
        nameSpaceSockets[nsId].on('nsChange', (data) => {
            console.log("Namespace Changed!");
            console.log(data);
        })
        listeners.nsChange[nsId] = true;
    }

    if(!listeners.numUsers[nsId]){
        nameSpaceSockets[nsId].on('numUsers', (numUsers) => {
            
            document.querySelector('.curr-room-num-users').innerHTML = ` ${numUsers} <span class="fa-solid fa-user"></span>`
            console.log("numUsers upgraded");
        })
        listeners.numUsers[nsId] = true;
    }

    if(!listeners.messageToRoom[nsId]){
        nameSpaceSockets[nsId].on('messageToRoom', (messageObj) => {
            console.log('messageObj', messageObj)
            document.querySelector('#messages').innerHTML+= buildMessageHtml(messageObj);
        })
        listeners.messageToRoom[nsId] = true
    }

}




socket.on('connect', () => {
    console.log('Connected!');
    socket.emit('clientConnect')
})

socket.on('welcome', (data) => {
    console.log(data);
})

//listen for the nsList event from the server which gives us the namespaces
socket.on('nsList', (nsData) => {
    console.log('nsData:', nsData);
    const nameSpacesDiv = document.querySelector('.namespaces');
    nameSpacesDiv.innerHTML = '';
    nsData.forEach(ns => {

        // aggiornare l'html con i namespace
        nameSpacesDiv.innerHTML += `
            <div class="namespace" ns="${ns.endpoint}">
                <img src="${ns.image}">
            </div>`
        
        // --- CONNESSIONE AGLI NS ---

        //initialize thisNs if the socket already exists
        let thisNs = nameSpaceSockets[ns.id];
        // if there is no socket at this nsId. Make a new connection
        if(!nameSpaceSockets[ns.id]){
            //join the namespaces with io()
            thisNs = io(`http://localhost:9000${ns.endpoint}`);
            nameSpaceSockets[ns.id] = thisNs;
        }
        
        addListeners(ns.id);
    });

    const defaultNs = document.querySelector('.namespace');
    if( defaultNs ) {
        joinNs(defaultNs, nsData);
    }
    

    // aggiungo l'event listener sul click
    const nameSpacesArr = Array.from(document.getElementsByClassName('namespace'))
    nameSpacesArr.forEach( element => {

        element.addEventListener('click', e => {
            joinNs(element, nsData);
        });

    });
})