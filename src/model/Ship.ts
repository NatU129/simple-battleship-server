import MongoConnector from './db/MongoConnector';

const connector = new MongoConnector();


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
    public fieldNo: string;

    constructor(type: string, no: number, fieldNo: string) {
        this.type = this.setType(type);
        this.health = this.setHealth();
        this.isSunk = false;
        this.isPlaced = false;
        this.no = no;
        this.fieldNo = fieldNo;

        this.saveNew();
    }

    private setType(type: string) {
        const t = type.toLowerCase();
        if (Object.keys(healthConfig).indexOf(t) >= 0)
            return t;
        else
            throw new Error('wrong ship type');
    }

    private setHealth() {
        if (!this.type) throw new Error('ship type is not set');

        return healthConfig[this.type];
    }

    public getAttacked(damage: number = 1) {
        this.health -= damage;

        connector.update('ship', {
            type: this.type,
            no: this.no
        }, {health: this.health}, (result) => {
            console.log('update ship health to ' + this.health);
        });
    }

    public getHealth() {
        return this.health > 0 ? this.health : 0;
    }

    public getType() {
        return this.type;
    }

    public saveNew(){
        connector.insert('ship', {
            type: this.type,
            health: this.health,
            isSunk: this.isSunk,
            isPlaced: this.isPlaced,
            no: this.no,
            fieldNo: this.fieldNo
        }, (result) => {
            console.log('add a new ship to the database');
        });
    }
}