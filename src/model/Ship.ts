const healthConfig: { [key: string]: number } = {
    battleship: 4,
    cruiser: 3,
    destroyer: 2,
    submarine: 1
}

export default class Ship {
    private health: number;
    private type: string;
    public no: number;
    public isPlaced: boolean;
    public isSunk: boolean;

    constructor(type: string, no: number) {
        this.type = this.setType(type);
        this.health = this.setHealth();
        this.isSunk = false;
        this.isPlaced = false;
        this.no = no;
    }

    private setType(type: string) {
        const t = type.toLowerCase();
        if (Object.keys(healthConfig).indexOf(t) >= 0)
            return t;
        else
            throw new Error('wrong ship type');
    }

    private setHealth() {
        if (!this.type) throw new Error('ship type is not set');;

        return healthConfig[this.type];
    }

    public getAttacked(damage: number = 1) {
        this.health -= damage;
    }

    public getHealth() {
        return this.health > 0 ? this.health : 0;
    }

    public getType() {
        return this.type;
    }
}