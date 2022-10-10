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
            )
        }
    }
}