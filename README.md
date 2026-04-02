# Socket.io Chat Demo

Questa demo serve a mostrare le potenzialità della libreria [Socket.io](https://socket.io/) nel fornire strumenti per la creazione di applicazioni web che necessitano di uno scambio di informazioni in tempo reale.
Nello specifico si tratta di una demo di un app di messaggistica che dispone di piu chat raggruppate in diversi canali.
Piu utenti possono collegarsi e scambiare messaggi nelle chat. Inoltre le chat dispongono di uno storico di messaggi che vengono caricati nel momento in cui vi si accede.

L'accesso ai canali è gentito tramite [Namespaces](https://socket.io/docs/v4/namespaces/) che permettono di suddividere una singola connessione in più canali virtuali, consentendo cosi l'invio di messaggi ai soli socket(Client) connessi ad un determinato Namespace

Per far si che solo gli utenti nella stessa chat ricevano i messaggi inviati sono state utilizzate le [Room](https://socket.io/docs/v4/rooms/) di Socket.io che permettono di emettere eventi ad un sottoinsieme di socket(Client) connessi ad un Namespace.

## Avvio della demo
Navigare alla root del progetto.

Eseguire il comando per scaricare le dipendenze necessarie.
```powershell
npm install
```
Eseguire il comando per l'avvio del server.
```powershell
node .\server.js
```
Da Browser navigare al seguente link <http://localhost/9000>

Se i comandi non dovessero funzionare sarà necessario scaricare Node al seguente [link](https://nodejs.org/en/download)
