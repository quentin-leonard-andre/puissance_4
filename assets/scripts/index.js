/** Déclaration des variables */

//Etapes
const STEPS = {
    MAIN_MENU: 0,
    IN_GAME: 1,
    END: 2
}

//Etape en cours
let current_step = STEPS.MAIN_MENU;

//Canva
let canva;

//Dimensions de la zone de jeu
let game_dimension = {
    width: 800,
    height: 500
}

//Couleurs de la grille
let grid_colors = {
    grid_background: '#8A897C',
    cell_background: '#353535',
    hover_column_background: '#BDBBB0'
};

//Objet représentant la partie
let game;

/** Initialisation du canva */
function setup(){   
    //On cache le canva par défaut
    createCanvas(0, 0);
    //Initialisation du menu principal
    initMainMenu();

    //Evenement de clic sur le canva
}
  
/** Dessin du canva */
function draw(){
    //Dessine si le jeu est en cours
    if(current_step != STEPS.MAIN_MENU){
        //Fond du canva
        background("#eee");
        //Affichage du jeu
        game.draw();
    }
}

/** Affiche la modale de fin de partie */
function displayEndGameModal(message){
    //Affichage de la modale de victoire
    let modal_container = document.getElementById('victory_modal_container');
    modal_container.classList.remove('hidden');

    //Affichage du message
    modal_container.querySelector('p.message').innerHTML = message;

    //Bouton de visualisation de la grille
    modal_container.querySelector('button[data-action="close_modal"]').addEventListener('click', () => {
        modal_container.classList.add('hidden');
    });
    
    //Bouton recommencer
    modal_container.querySelector('button[data-action="restart"]').addEventListener('click', () => {
        modal_container.classList.add('hidden');
        initGame();
    });
}

/** Lance le jeu */
async function initGame(){
    //Création de la partie
    game = new Game(
        new Grid(game_dimension.width, game_dimension.height, 5, 8, grid_colors)
    );

    //Création du canva
    canva = createCanvas(800, 500);
    canva.id('game');
    //Positionnement du canvas
    canva.parent('grid_container');

    //Evenement de clic sur le canva
    canva.canvas.removeEventListener('click', onGameCanvaClick);
    canva.canvas.addEventListener('click', onGameCanvaClick);

    //Ajout des joueurs
    game.addPlayer(new Player(0, "Joueur 1", "yellow"));
    game.addPlayer(new Player(1, "Joueur 2", "red"));
    //Sélection du premier joueur
    game.player_turn = game.players[0];

    //Affichage graphique des joueurs
    let players_container = document.getElementById('players_container');
    players_container.style.height = game_dimension.height + "px";
    players_container.innerHTML = "";
    game.players.forEach(player => {
        document.getElementById('players_container').innerHTML += player.getPlayerInformationsDOM((player.id == game.player_turn.id));
    });

    //Changement d'étape
    current_step = STEPS.IN_GAME;
}

/** Au clic sur le canva de jeu */
function onGameCanvaClick(){
    //Si la partie existe et que la partie n'est pas terminée
    if(game && current_step!=STEPS.END){
        //Récupération de la colonne sélectionnée
        let hover_column = game.grid.getHoverColumn();
        //Si une colonne est sélectionnée
        if(hover_column != -1){
            let new_pawn_row_index = game.grid.addPawn(hover_column, game.player_turn.id);
            //Ajout du jeton du joueur dont c'est le tour
            if(new_pawn_row_index != -1){
                //On checke si il existe un gagnant
                let winner_id = game.grid.getWinnerId();

                //Si pas de gagnant
                if(winner_id == -1){
                    //Gestion du tour suivant
                    game.nextTurn();
                }
                //Si match nul
                else if(winner_id == -2){
                    current_step = STEPS.END;
                    //Affichage de la modale d'égalité
                    displayEndGameModal("Match nul.");
                }
                //Si un gagnant
                else{
                    //Récupération gagnant
                    let winner = game.players.find(player => player.id == winner_id);
                    current_step = STEPS.END;

                    //Affichage de la modale de victoire
                    displayEndGameModal(winner.name + " a gagné.");
                }
            }
        }
    }
}

/** Affichage du menu principal */
function initMainMenu(){
    //Sélection de l'élément du DOM contenant le menu
    let main_menu_dom = document.querySelector("#menu_container > #main_menu");

    //Affichage du panel courant
    main_menu_dom.classList.remove('hidden');
    
    //Sélection du bouton de lancement d'une nouvelle partie
    main_menu_dom.querySelector('button[data-action="new_game"]').addEventListener('click', (e) => {
        //On cache le menu principal
        main_menu_dom.classList.add('hidden');
        //Ouverture de la fenêtre de choix d'un mode de jeu
        initModeChoiceMenu();
    })
}

/** Affichage du menu de choix du mode de jeu */
function initModeChoiceMenu(){
    //Sélection de l'élément du DOM contenant le menu
    let mode_choice_menu_dom = document.querySelector("#menu_container > #mode_choice_menu");

    //Affichage du panel courant
    mode_choice_menu_dom.classList.remove('hidden');

    //Sélection du bouton joueur contre joueur
    mode_choice_menu_dom.querySelector('button[data-action="player_versus_player"]').addEventListener('click', () => {
        //On cache le menu de sélection du mode
        mode_choice_menu_dom.classList.add('hidden');
        //Lancement du jeu
        initGame();
    });

    //Bouton de retour
    mode_choice_menu_dom.querySelector('button[data-action="back"]').addEventListener('click', () => {
        //On cache le menu de sélection du mode
        mode_choice_menu_dom.classList.add('hidden');

        initMainMenu();
    });
}

/** Affichage du menu de personnalisation des joueurs */