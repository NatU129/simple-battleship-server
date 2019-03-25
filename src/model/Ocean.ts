import Field from "./Field";
import MongoConnector from './db/MongoConnector';

const fieldSize: [number, number] = [10, 10];

export default class Ocean {
    private field: { [key: number]: Field; } = {};

    constructor() {
        const connector = new MongoConnector();
        connector.getAll('field', (docs) => {
            if (docs.length > 0) {
                this.field = docs;
            }
            else {
                this.addField(fieldSize);
            }
        });

    }

    /**
     * 
     * @param size field size
     * @param fno field number (in case play on multiple field)
     */
    public addField(size: [number, number], fno: number = 0): void {
        this.field[fno] = (new Field(size));
        this.field[fno].saveNew();
    }

    /**
     * 
     * @param fno field number (in case play on multiple field)
     * @returns status object (coordination attacked, ships remaining) for debugging
     */
    public getFieldStatus(fno: number = 0) {
        return this.getField(fno).getStatus();
    }

    /**
     * 
     * @param fno field number (in case play on multiple field)
     * @returns true if success
     */
    public clear(fno: number = 0): boolean {
        if (this.field[fno]) {
            const connector = new MongoConnector();
            connector.delete('field', { no: this.field[fno].no }, (result) => {
                console.log('delete field: ' + this.field[fno].no + 'from database');
                delete this.field[fno];
                this.addField(fieldSize);
            });
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param fno field number (in case play on multiple field)
     */
    public getField(fno: number = 0): Field {
        if (this.field[fno]) {
            return this.field[fno];
        } else {
            throw new Error('cannot get field: ' + fno);
        }

    }

}