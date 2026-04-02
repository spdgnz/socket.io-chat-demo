const buildMessageHtml = (messageObj) => {
    const time = new Date(messageObj.date).toLocaleString()
    /* orario in formato 15:30
    .toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    */

    return `
    <li>
        <div class="user-image">
            <img src="https://placehold.net/avatar-4.png" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${messageObj.userName} <span class="timestamp">${time}</span></div>
            <div class="message-text">${messageObj.newMessage}</div>
        </div>
    </li>
    `
}