/** Classe représentant une grille de jeu */
class Grid{
    /** Constructeur */
    constructor(
        width,
        height,
        rows_number,
        columns_number,
        colors
    ){
        //Largeur de la grille
        this.width = width;
        //Hauteur de la grille
        this.height = height;
        //Nombre de lignes
        this.rows_number = rows_number;
        //Nombre de colonnes
        this.columns_number = columns_number;
        //Couleurs
        this.colors = colors;

        //Contenu de la grille
        this.content = this.getEmptyGrid();
    }

    /** Retourne une grille vide */
    getEmptyGrid(){
        let res = [];
        //Parcours lignes par lignes
        for(let row_index = 0; row_index < this.rows_number; row_index++){
            let row_content = [];
            //Parcours colonnes par colonnes
            for(let column_index = 0; column_index < this.columns_number; column_index++){
                row_content.push('.');
            }
            res.push(row_content);
        }
        return res;
    }

    /** Dessine la grille dans un canva P5 */
    draw(players){
        fill(this.colors.grid_background);
        noStroke();
        //Dessin de la grille
        rect(0, 0, this.width, this.height);

        //Gestion survol des colonnes
        if(this.getWinnerId() == -1)
            this.drawHoverColumn();

        //Calcul de la hauteur d'une ligne
        let row_height = (this.height / this.rows_number);
        //Espacement entre les emplacements de pions
        let grid_gap = 20;
        //Parcours des lignes
        for(let row_index = 0; row_index < this.rows_number; row_index++){
            //Parcours des colonnes
            for(let column_index = 0; column_index < this.columns_number; column_index++){
                //Calcul des variables du cercle courant
                let circle = {
                    x: ((this.getColumnWidth() * column_index) + (this.getColumnWidth()/2)),
                    y: (row_height * row_index) + (row_height/2),
                    radius: this.getColumnWidth() - grid_gap
                }
                
                //Si un pion est mis
                if(this.content[row_index][column_index] != '.')
                    fill(
                        (players.find(player => player.id == this.content[row_index][column_index])).color
                    );
                //SI aucun pion
                else{
                    //Couleur cellule vide
                    fill(this.colors.cell_background);
                }   

                //Dessin du cercles
                ellipse(
                    circle.x,
                    circle.y,
                    circle.radius,
                    circle.radius
                );
            }
        }
    }

    /** Retourne la largeur d'une colonne */
    getColumnWidth(){
        return this.width / this.columns_number;
    }

    /** Evenement de survol d'un cercle */
    isCircleHover(x, y, radius){
        //Distance de la souris par rapport à l'ellipse courante
        let distance = dist(mouseX, mouseY, x, y);
        return distance < (radius/2);
    }

    /** Retourne l'index de la colonne survolée si existant, -1 sinon */
    getHoverColumn(){
        let res = -1;
        //Parcours des colonnes
        for(let column_index = 0; column_index < this.columns_number; column_index++){
            //Si la colonne courante est survolée
            if(
                mouseX > (this.getColumnWidth() * column_index) && 
                mouseX < (this.getColumnWidth() * (column_index + 1)) &&
                mouseY > 0 &&
                mouseY < this.height
            ){
                res = column_index;
                break;
            }
        }
        return res;
    }

    /** Surligne la colonne survolée */
    drawHoverColumn(){
        //Si une colonne est survolée
        if(this.getHoverColumn() != -1){
            //On la colorie
            fill(this.colors.hover_column_background);
            rect(
                this.getColumnWidth() * this.getHoverColumn(),
                0,
                this.getColumnWidth(),
                this.height
            );
            
        }
    }

    /** Ajoute un pion */
    addPawn(column_index, pawn){
        let row_res = -1;
        //Parcours de la colonne de bas en haut
        for(let row_index = (this.rows_number-1); row_index >= 0; row_index--){
            //Récupération de la cellule courante
            let current_cell = this.content[row_index][column_index];

            //Si la cellule est un point
            if(current_cell == '.'){
                this.content[row_index][column_index] = pawn;
                row_res = row_index;
                break;
            }
        }

        return row_res;
    }

    /** Retourne l'id du gagnant, -1 sinon, -2 si match nul */
    getWinnerId(){
        let winner_id = -1;

        //Vérification match nul
        let full_grid = true;

        //Parcours des lignes
        for(let row_index = 0; row_index < this.rows_number; row_index++){
            //Parcours des colonnes
            for(let column_index = 0; column_index < this.columns_number; column_index++){
                let current_cell_value = this.content[row_index][column_index];

                //Si la cellule courante corresponds à un jeton
                if(current_cell_value != '.'){

                    let tmp_row_index, tmp_column_index;

                    //Parcours horizontal
                    let nb_horizontal = 0;
                    tmp_column_index = column_index;
                    while(tmp_column_index < this.columns_number && this.content[row_index][tmp_column_index ] == current_cell_value){
                        nb_horizontal++;
                        tmp_column_index++;
                    }
                    //Si le nombre courant dépasse la limite de victoire
                    if(nb_horizontal >= 4){
                        winner_id = current_cell_value;
                    }

                    //Parcours vertical
                    let nb_vertical = 0;
                    tmp_row_index = row_index;
                    while(tmp_row_index < this.rows_number && this.content[tmp_row_index][column_index] == current_cell_value){
                        nb_vertical++;
                        tmp_row_index++;
                    }
                    //Si le nombre courant dépasse la limite de victoire
                    if(nb_vertical >= 4){
                        winner_id = current_cell_value;
                    }

                    //Parcours diagonale haut gauche vers bas droite
                    let nb_top_left_to_bottom_right = 0;
                    tmp_row_index = row_index;
                    tmp_column_index = column_index;
                    while(
                        tmp_row_index < this.rows_number &&
                        tmp_column_index < this.columns_number &&
                        this.content[tmp_row_index][tmp_column_index] == current_cell_value
                    ){
                        nb_top_left_to_bottom_right++;
                        tmp_row_index++;
                        tmp_column_index++;
                    }
                    //Si le nombre courant dépasse la limite de victoire
                    if(nb_top_left_to_bottom_right >= 4){
                        winner_id = current_cell_value;
                    }
                    
                    //Parcours diagonale bas gauche vers haut droite
                    let nb_bottom_left_to_top_right = 0;
                    tmp_row_index = row_index;
                    tmp_column_index = column_index;
                    while(
                        tmp_row_index >= 0 &&
                        tmp_column_index < this.columns_number &&
                        this.content[tmp_row_index][tmp_column_index] == current_cell_value
                    ){
                        nb_bottom_left_to_top_right++;
                        tmp_row_index--;
                        tmp_column_index++;
                    }
                    //Si le nombre courant dépasse la limite de victoire
                    if(nb_bottom_left_to_top_right >= 4){
                        winner_id = current_cell_value;
                    }
                }
                //Si la case courante est vide
                else{
                    full_grid = false;
                }
            }
        }

        //Si la grille est pleine
        if(winner_id == -1 && full_grid)
            winner_id = -2;

        return winner_id;
    }
}