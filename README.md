# Progetto TPI
```
git fetch
git status
git pull
git add .
git commit -m "descrizione"
git push
```


# Documentazione Progetto: Kanban Board Digitale

## 1. Introduzione

Questo progetto ha come obiettivo la realizzazione di una **Kanban Board digitale**, uno strumento informatico per la gestione visuale di attività e task, ispirato alla metodologia Agile. La Kanban Board permette di organizzare i compiti in colonne rappresentanti gli stati di avanzamento (es. Da fare, In corso, Fatto), migliorando la gestione del lavoro individuale o di gruppo.

## 2. Obiettivi del progetto

* Creare una web app semplice e intuitiva per la gestione delle attività.
* Consentire l’aggiunta, modifica, spostamento e cancellazione di task.
* Organizzare i task in colonne rappresentanti lo stato di avanzamento.
* Salvare i dati in modo persistente (es. localStorage o database).
* Garantire un’interfaccia responsive, accessibile da desktop e mobile.

## 3. Tecnologie utilizzate

* **Frontend**: HTML, CSS, JavaScript (oppure framework come React, Vue, Angular).
* **Backend** (opzionale, se previsto): Node.js con Express, Python con Flask/Django, o altro.
* **Database** (se previsto): MongoDB, MySQL, SQLite o localStorage per persistente lato client.
* **Strumenti**: Editor di codice (VS Code), Git per versionamento.

## 4. Descrizione funzionalità

* **Creazione task**: L’utente può inserire un nuovo task con titolo e descrizione.
* **Modifica task**: È possibile modificare il contenuto di un task.
* **Spostamento task**: Drag and drop dei task tra colonne (Da fare, In corso, Fatto).
* **Eliminazione task**: Rimuovere un task completato o non più necessario.
* **Salvataggio dati**: I task e lo stato della board vengono salvati per non perdere le modifiche.
* **Filtri e ricerche** (opzionale): Ricerca di task per parola chiave o filtro per categoria.

## 5. Architettura del progetto

* **Frontend**: Gestisce l’interfaccia utente e le interazioni (drag & drop, form).
* **Backend**: Riceve e memorizza i dati, gestisce le richieste API (se presente).
* **Database**: Conserva i dati dei task e lo stato della board.

## 6. Diagrammi (opzionale)

* Diagramma delle classi / componenti.
* Diagramma di flusso delle funzionalità.
* Wireframe dell’interfaccia utente.

## 7. Installazione e avvio

### Requisiti

* Node.js e npm (se backend o frontend con toolchain)
* Browser moderno

### Istruzioni

1. Clonare il repository:

   ```bash
   git clone https://github.com/tuo-username/kanban-board.git
   ```
2. Installare le dipendenze:

   ```bash
   cd kanban-board
   npm install
   ```
3. Avviare il progetto:

   ```bash
   npm start
   ```
4. Aprire il browser all’indirizzo: `http://localhost:3000`

## 8. Test e verifica

* Descrivere i test effettuati per verificare le funzionalità principali.
* Segnalare eventuali bug noti o limitazioni.

## 9. Conclusioni

Il progetto ha permesso di realizzare una semplice Kanban Board funzionale, utile per la gestione di task in ambito scolastico o personale. È stato un buon esercizio per comprendere la programmazione frontend, la gestione dello stato e le interazioni utente.

## 10. Riferimenti e fonti

* Documentazione ufficiale di React / Vue / altro
* Tutorial utilizzati
* Librerie esterne integrate
