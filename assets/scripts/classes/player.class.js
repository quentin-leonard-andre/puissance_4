/** Classe représentant un joueur */
class Player{
    /** Constructeur */
    constructor(
        id,
        name,
        color
    ){
        this.id = id,
        this.name = name;
        this.color = color;
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
}