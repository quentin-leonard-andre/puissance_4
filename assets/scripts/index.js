/** Déclaration des variables */

//Etapes
const STEPS = {
    MAIN_MENU: 0,
    IN_GAME: 1,
    END: 2
}

//Modes de jeu
const GAME_MODES = {
    NONE: -1,
    PLAYER_VS_PLAYER: 0,
    PLAYER_VS_COMPUTER: 1
};

//Etape en cours
let current_step = STEPS.MAIN_MENU;

//Mode de jeu
let current_game_mode = GAME_MODES.PLAYER_VS_COMPUTER;

//Canva
let canva;

//Dimensions de la zone de jeu
let game_dimension = {
    width: 600,
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
    //Initialisation de la barre de navigation
    initHeader();
    //Initialisation du menu principal
    initMainMenu();
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
    //Affichage du panel
    document.getElementById('game_container').classList.remove('hidden');

    //Création de la partie
    game = new Game(
        new Grid(game_dimension.width, game_dimension.height, 6, 7, grid_colors)
    );

    //Création du canva
    canva = createCanvas(game_dimension.width, game_dimension.height);
    canva.id('game');
    //Positionnement du canvas
    canva.parent('grid_container');

    //Evenement de clic sur le canva
    canva.canvas.removeEventListener('click', onGameCanvaClick);
    canva.canvas.addEventListener('click', onGameCanvaClick);

    //Selon le mode de jeu
    switch(current_game_mode){
        //Joueur contre joueur
        case GAME_MODES.PLAYER_VS_PLAYER:
            //Ajout des joueurs
            game.addPlayer(new Player(0, "Joueur 1", "yellow"));
            game.addPlayer(new Player(1, "Joueur 2", "red"));
        break;
        
        //Joueur contre ordinateur
        case GAME_MODES.PLAYER_VS_COMPUTER:
            //Ajout des joueurs
            game.addPlayer(new Player(0, "Joueur 1", "yellow"));
            game.addPlayer(new Player(1, "Ordinateur", "orange", true));
        break;
    }
    
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

    //Barre d'action
    initGameActionsBar();
}

/** Initialise l'affichage de la barre d'action */
function initGameActionsBar(){
    //Sélection de la barre d'actions
    let dom_actions_bar = document.querySelector('#game_container #game_actions_row');
    
    //Bouton Recommencer
    dom_actions_bar.querySelector('button[data-action="restart"]').addEventListener('click', () => {
        initGame();
    });
}

/** Au clic sur le canva de jeu */
function onGameCanvaClick(){
    //Si la partie existe et que la partie n'est pas terminée et que le joueur dont c'est le tour n'est pas un ordinateur
    if(game && current_step!=STEPS.END && (!game.player_turn.is_computer)){
        //Récupération de la colonne sélectionnée
        let hover_column = game.grid.getHoverColumn();
        //Si une colonne est sélectionnée
        if(hover_column != -1){
            let new_pawn_row_index = game.grid.addPawn(hover_column, game.player_turn.id);
            game.nextTurn();
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
        //Changement du mode de jeu
        current_game_mode = GAME_MODES.PLAYER_VS_PLAYER;
        //Lancement du jeu
        initGame();
    });

    //Sélection du bouton joueur contre ordinateur
    mode_choice_menu_dom.querySelector('button[data-action="player_versus_computer"]').addEventListener('click', () => {
        //On cache le menu de sélection du mode
        mode_choice_menu_dom.classList.add('hidden');
        //Changement du mode de jeu
        current_game_mode = GAME_MODES.PLAYER_VS_COMPUTER;
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

/** Initialisation de l'entête */
function initHeader(){
    //Récupération de l'élément du DOM
    let header_dom = document.querySelector('header');

    //Menu mobile
    header_dom.querySelector('#toggle_mobile_menu_button').addEventListener('click', () => {
        header_dom.querySelector('nav').classList.toggle('mobile_open');
    });

    //Bouton de redirection vers le menu
    header_dom.querySelector('button[data-action="main_menu"]').addEventListener('click', () => {
        hideAllMain();
        initMainMenu();
    });
}

/** Dissimule tous les encarts enfants du sélecteur de dom parent fourni en paramètre */
function hideAllChildren(dom_selector){
    let parent_dom = document.querySelector(dom_selector);

    [...parent_dom.children].forEach(child => {
        child.classList.add('hidden');
    })
}

/** Dissimule tous les encarts présents dans la zone principale */
function hideAllMain(){
    hideAllChildren('main');
    hideAllChildren('main #menu_container');
}