import Ocean from "./Ocean";

export default class Game{
    public ocean: Ocean;

    private static myGame: Game;

    constructor(){
        this.ocean = new Ocean();
    }

    /**
     * @returns return current game
     */
    public static getSelf(){
        if(!this.myGame) this.myGame = new Game();

        return this.myGame;
    }
}