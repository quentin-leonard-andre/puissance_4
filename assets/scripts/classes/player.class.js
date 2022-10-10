/** Classe représentant un joueur */
class Player{
    /** Constructeur */
    constructor(
        id,
        name,
        color,
        is_computer = false
    ){
        this.id = id,
        this.name = name;
        this.color = color;
        this.is_computer = is_computer;
    }

    /** Retourne le DOM permettant l'affichage graphique des informations du joueur */
    getPlayerInformationsDOM(is_turn){
        return `
            <div data-id="` + this.id + `" class="player_informations_panel ` + (is_turn ? 'is_turn':'') + `">
                <div class="color_displayer" style="background-color: ` + this.color + `;">
                </div>
                <label>` + this.name + `</label>
            </div>
        `;
    }

    /** Fait jouer le joueur aléatoirement, prends la grille de jeu en paramètre */
    randomPlay(grid){
        //Récupère un nombre aléatoire parmis les colonnes vides restantes
        let availables_columns = grid.getAvailablesColumnsIds();
        if(availables_columns.length > 0){
            grid.addPawn(
                availables_columns[Math.floor(Math.random()*availables_columns.length)],
                this.id
            );
        }
    }

    /** Evalue l'état du jeu pour un joueur donné */
    getHeuristic(game, player = this){
        let res = 0
        let winner_id = game.grid.getWinnerId();

        if(winner_id == player.id){
            res = 1;
        }
        else if(winner_id != -1){
            res = -1;
        }
        
        return res;
    }

    /** Effectue une prédiction selon un jeu, une colonne et un joueur, renvoie l'heuristique associée au mouvement courant */
    predict(game, col, player){
        //Copie de l'objet de jeu
        let tmp_game = _.cloneDeep(game);

        tmp_game.grid.addPawn(col, player.id);

        //Renvoie l'heuristique
        return this.getHeuristic(tmp_game, player);
    }

    /** Détermine un choix */
    makeChoice(game, player){
        let column_to_play = null;
        let heuristics = [];
        
        //Parcours de toutes les colonnes disponibles
        game.grid.getAvailablesColumnsIds().forEach(col_index => {
            //Prédiction de défense
            [...game.players.filter(player => player.id != game.player_turn.id)].forEach(ennemy => {
                heuristics.push({
                    value: this.predict(game, col_index, ennemy),
                    col_index: col_index
                });
            });

            //Prédiction d'attaque
            heuristics.push({
                value: this.predict(game, col_index, player),
                col_index: col_index
            });
        });

        return heuristics.sort((a,b) => b.value - a.value)[0].col_index;
    }
}