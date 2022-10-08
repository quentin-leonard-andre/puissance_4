/** Classe représentant une partie */
class Game{
    /** Constructeur */
    constructor(grid){
        this.grid = grid;
        this.players = [];
        this.dom_container_id = 'game_container';

        //Joueur dont c'est le tour
        this.player_turn = -1;
    }

    /** Ajoute un joueur à la partie */
    addPlayer(player){
        this.players.push(player);
    }

    /** Dessine le plateau de jeu */
    draw(){
        this.grid.draw(this.players);
    }

    /** Passe au tour suivant */
    nextTurn(){
        //Récupération de l'id du tableau des joueurs correspondant au joueur dont c'est le joueur
        let player_turn_array_index = this.players.findIndex(player => player.id == this.player_turn.id);
        //Suppression de la classe dans l'affichage graphique
        document.getElementsByClassName('is_turn').forEach(dom_element => {
            dom_element.classList.remove('is_turn');
        })
        
        //Si on arrive à la fin du tableau de joueurs
        if(player_turn_array_index >= this.players.length-1){
            this.player_turn = this.players[0];
        }
        else{
            this.player_turn = this.players[player_turn_array_index + 1];
        }

        //Ajout de la classe dans l'affichage graphique
        document.querySelector('.player_informations_panel[data-id="' + this.player_turn.id + '"]').classList.add('is_turn');
    }

    /** Dissimulation du jeu */
    hide(){
        document.getElementById(this.dom_container_id).classList.add('hidden');
    }

    /** Affichage du jeu */
    display(){
        document.getElementById(this.dom_container_id).classList.remove('hidden');
    }
}