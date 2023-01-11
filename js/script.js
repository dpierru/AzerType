class Jeu {
    constructor() {
        // Pré-affiche un premier mot
        this.afficherMotSuivant();

        // Initialise les écouteurs d'événements
        this.initAddEventListeners();

        // Avant de commencer, aucun mot n'est trouvé !
        this.nbMotsCorrects = 0;

        // Initialise la variable qui contiendra le timer. 
        this.timer = null;

        // Initialise le nombre de seconde écoulées
        this.nbSecondeEcoulee = 0;
    }

    /**
     * Cette méhode initialise les écouteurs d'événements
     */
    initAddEventListeners() {   
        // Traite le mot entré par l'utilisateur quand on clique sur le bouton
        document.querySelector('#btnValiderMot').addEventListener('click', () => {
            this.verifierEntree();
        })

        // Traite le mot entré par l'utilisateur quand on appuie sur la touche entrée
        document.querySelector('#inputEcriture').addEventListener('keyup', (event) => {
            if (event.key === 'Enter') { 
                // Si c'est l'input de saisie qui a le focus, on vérifie le mot
                if (document.querySelector('#inputEcriture') == document.activeElement) {
                    this.verifierEntree();
                }
            }
        })

        // Ferme la popup de résultat quand on clique sur le bouton "fermerPopup"
        document.querySelector('#fermerPopup').addEventListener('click', () => {
            document.querySelector('.popupResultat').classList.remove('active');
        })

        // Ouvre la popup de partage "popupPartage" quand on clique sur le bouton "afficherFormulairePopup"
        document.querySelector('#afficherFormulairePopup').addEventListener('click', () => {
            document.querySelector('.popupPartage').classList.add('active');
            // On donne le focus au champ qui a le name "nom"   
            document.querySelector('input[name="nom"]').focus();
            
        })

        // Active le traitement du formulaire de partage quand on clique sur le bouton "btnEnvoyerMail"
        document.querySelector('#btnEnvoyerMail').addEventListener('click', (event) => {
            this.traiterFormulairePartage(event);
        })

        // ferme la popup de partage quand on clique sur le bouton "fermerPopupPartage"
        document.querySelector('#fermerPopupPartage').addEventListener('click', () => {
            document.querySelector('.popupPartage').classList.remove('active');
        })
    }


    /**
     * Cette méthode lance le timer s'il n'est pas déjà lancé. 
     * Le timer est stocké dans this.timer
     */
    demarerTimer() {
        // Si le timer n'est pas encore lancé
        if (this.timer == null) {
            // On crée le timer grâce à la méthode "setInterval"
            this.timer = setInterval(() => {
                console.log('Timer');
                this.nbSecondeEcoulee++;
                this.verifierTimer();
                // Mets à jour la zoneTimer avec le nombre de seconde écoulées
                document.querySelector('.zoneTimer').innerHTML = dureeJeu - this.nbSecondeEcoulee;
            }, 1000);

            // Et dans tous les cas, on met à jour la zoneTimer avec le nombre de seconde écoulées
            document.querySelector('.zoneTimer').innerHTML =  dureeJeu - this.nbSecondeEcoulee;
        }
    }

    /**
     * Cette méthode arrête le timer qui est stocké dans this.timer. 
     */
    arreterTimer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    /**
     * Cette méthode vérifie le timer. Si nous sommes arrivés au nombre de seconde requise (définie dans const.js), 
     * alors on arrête le timer
     */
    verifierTimer() {
        if (this.nbSecondeEcoulee >= dureeJeu) {
            this.arreterTimer();
            this.afficherResultat();
            this.nbSecondeEcoulee = 0;
            this.nbMotsCorrects = 0;
            document.querySelector('.zoneTimer').innerHTML = "Pause";
        }
    }

    afficherResultat() {
        // Switch pour afficher le bon message en fonction de l'optionSource choisie
        let message = `Vous avez tapé ${this.nbMotsCorrects} mot(s) correctement en ${dureeJeu} secondes.`
    
        // Affiche le message dans la zone de résultat
        document.querySelector('.zoneResultat').innerHTML = message;
        this.afficherPopupResultat(message);

    }

    /**
     * Cette méthode affiche la popup qui contient le résultat
     */
    afficherPopupResultat(message) {
        const popup = document.querySelector('.popupResultat');
        // On affiche le message dans la popup   
        popup.querySelector('.message').innerHTML = message;
        // On affiche la popup
        popup.classList.add('active');
        // On donne le focus au bouton "fermerPopup"
        popup.querySelector('#afficherFormulairePopup').focus();
    }

   

    /**
     * Cette méthode retourne un mot au hasard dans la liste de mots
     */
    afficherMotSuivant() {
        let nouveauMot = listeMot[Math.floor(Math.random() * listeMot.length)];
        document.querySelector('.zoneReference').innerHTML = nouveauMot;
    }

    /**
     * Cette méthode vérifie que le mot entré par l'utilisateur est bien le mot attendu dans la zone de saisie. 
     */
    verifierEntree() {
        // Lance le timer si il n'est pas déjà lancé
        this.demarerTimer();

        let entree = document.querySelector('#inputEcriture').value;
        let reference = document.querySelector('.zoneReference').innerText;
        console.log(entree, reference);

        // On vide la zone de saisie
        document.querySelector('#inputEcriture').value = '';

        if (entree == reference) {
            console.log('Bravo !');
            this.nbMotsCorrects++;
        } else {
            console.log('Dommage !');
        }

        this.afficherMotSuivant();
    }

    /**
     * Cette méthode va lire les champs du formulaire de partage (nom et email), vérifie que ces champs sont correctement formattés
     * et ouvre un email (mailto) avec les informations du formulaire pré-remplies.
     */
    traiterFormulairePartage(event) {
        event.preventDefault();

        // On récupère les valeurs des champs du formulaire
        let nom = document.querySelector('#nomPartage').value;
        let email = document.querySelector('#emailPartage').value;

        // On vérifie que les champs sont bien remplis
        if (nom == '' || email == '') {
            alert('Veuillez remplir les champs "nom" et "email"');
            return;
        }

        // On vérifie que l'email est bien formatté
        if (!this.verifierEmail(email)) {
            alert('Veuillez entrer un email valide');
            return;
        }

        // On ouvre un email avec les informations du formulaire pré-remplies
        let mailto = `mailto:${email}?subject=Partage de résultat&body=Bonjour ${nom},%0D%0A%0D%0AJe t'envoie ce mail pour te partager mon résultat au jeu de l'écriture :%0D%0A%0D%0AJe suis arrivé à ${this.nbMotsCorrects} mots corrects en ${dureeJeu} secondes.%0D%0A%0D%0ABonne journée !`;
        //window.open(mailto);
        window.location.href = mailto;
    }

    /**
     * cette méthode vérifie que l'email est bien formatté
     * @param {string} email
     * @returns {boolean} : true si l'email et correct, false sinon. 
     */
    verifierEmail(email) {
        // On vérifie que l'email est bien formatté grâce à une expression régulière
        let regex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
        return regex.test(email);
    }

}