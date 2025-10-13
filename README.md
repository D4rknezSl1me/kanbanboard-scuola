# Progetto TPI
**PULL**
```bash
git fetch                        # Scarica changes remote, non modifica copia locale
git status                       # Stato versione locale rispetto alle changes remote
git pull                         # Unisce le changes remote alla versione locale
```

**PUSH**
```bash
git status                       # Per mostrare quali file sono tracked per il commit
git add .                        # Trackka i file da committare, . per tutti, se no scrivere il nome
git commit -m "descrizione"      # Salva i changes in locale, pronti da essere pushati, best practice fare molti commit cosi da avere checkpoints dello stato del lavoro, descrizioni piu dettagliati di ogni cambiamento cosi da poter poi resettare a un commit intermedio in caso di errori o bug
git push                         # Aggiorna il branch remoto con le changes locali committate
```

**BRANCHING**
```bash
git switch -c branch_name        # Create and move to the branch
git switch branch_name           # Move to the branch
git branch --list                # Lista dei branch
git status                       # Mostra su che branch sei e posizione rispetto al main
```


# Documentazione Progetto: Kanban Board Digitale

## 1. Introduzione

Questo progetto ha come obiettivo la realizzazione di una **Kanban Board digitale**, uno strumento informatico per la gestione visuale di attività e task. La Kanban Board permette di organizzare i compiti in colonne rappresentanti gli stati di avanzamento (es. Da fare, In corso, Da Revisionare e Fatto), migliorando la gestione del lavoro individuale o di gruppo.

## 2. Obiettivi del progetto

* Creare una web app semplice e intuitiva per la gestione delle attività.
* Consentire l’aggiunta, modifica, spostamento e cancellazione di task.
* Organizzare i task in colonne rappresentanti lo stato di avanzamento.
* Salvare i dati in modo persistente (localStorage).
* Garantire un’interfaccia responsive, accessibile da desktop e possibilmente da mobile.

## 3. Tecnologie utilizzate

* **Frontend**: HTML, CSS, JavaScript (Tailwind).
* **Backend** Js
* **Strumenti**: Editor di codice (VS Code), Git per versionamento.

## 4. Descrizione funzionalità

* [x] **Creazione task**: L’utente può inserire un nuovo task con titolo e descrizione.
* [ ] **Modifica task**: È possibile modificare il contenuto di un task.
* [ ] **Spostamento task**: Drag and drop dei task tra colonne (Da fare, In corso, Fatto).
* [ ] **Eliminazione task**: Rimuovere un task completato o non più necessario.
* [ ] **Salvataggio dati**: I task e lo stato della board vengono salvati per non perdere le modifiche.
* [ ] **Filtri e ricerche** (opzionale): Ricerca di task per parola chiave o filtro per categoria.

## 5. Architettura del progetto

* **Frontend**: Gestisce l’interfaccia utente e le interazioni.
* **Backend**: Riceve e memorizza i dati dal form, gestisce le parti dinamiche della pagina (drag & drop, form).


### Istruzioni

1. Clonare il repository:

   ```bash
   git clone https://github.com/D4rknezSl1me/kanbanboard-scuola.git
   ```
2. Avviare un server:

   ```bash
   python -m http.server
   # oppure
   python3 -m http.server
   ```
3. Alternativamente usa live server su vscode:

   ```bash
   https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
   ```
4. Aprire il browser all’indirizzo: 
   ```bash
   # Live Server (la porta potrebbe cambiare)
   http://127.0.0.1:5500/
   
   # Python http server (la porta potrebbe cambiare)
   http://127.0.0.1:8000/
   ```

## 8. Test e verifica

* Descrivere i test effettuati per verificare le funzionalità principali.
* Segnalare eventuali bug noti o limitazioni.

## 9. Conclusioni

Il progetto ha permesso di realizzare una semplice Kanban Board funzionale, utile per la gestione di task in ambito scolastico o personale. È stato un buon esercizio per comprendere la programmazione frontend, la gestione dello stato e le interazioni utente.

## 10. Riferimenti e fonti

* Documentazione ufficiale di Tailwind / W3Schools 
* Librerie esterne integrate: Tailwind

# Collezione Carpe
![](assets/imgs/sexy_carpa_graffiti.png)
