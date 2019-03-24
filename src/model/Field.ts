import Fleet from './Fleet';

const fleet = {
    battleship: 1,
    cruiser: 2,
    destroyer: 3,
    submarine: 4
}

export default class Field {
    //private static readonly type = 'battlefield';
    //private id: string;
    private attackedArea: string[][];
    public fleet: Fleet;
    public totalShot: number;
    public missedShot: number;

    constructor(size: [number, number]) {
        //initiate area
        this.attackedArea = [];
        for (var i: number = 0; i < size[1]; i++) {
            this.attackedArea[i] = [];
            for (var j: number = 0; j < size[0]; j++) {
                this.attackedArea[i][j] = '';
            }
        }

        this.totalShot = 0;
        this.missedShot = 0;

        this.fleet = this.addFleet(fleet, size);
    }

    public addFleet(fleet: { [s: string]: number; }, size: [number, number]) {
        return new Fleet(fleet, size);
    }

    public getAttacked(posX: number, posY: number) {
        if (!this.fleet.isAllShipsPlaced()) throw new Error('Not all of ships are placed');
        if (this.attackedArea[posY][posX] !== '') throw new Error('Already been attacked');

        const isHit = this.fleet.isHit(posX, posY);

        this.totalShot++;

        if (isHit === 'Miss') {
            this.attackedArea[posY][posX] = 'o';
            this.missedShot++;
        } else {
            this.attackedArea[posY][posX] = 'x';
        }

        console.log('Field status\n' +
            this.attackedArea.map((t1) => {
                return '|' + t1.map((t2) => t2 === '' ? ' ' : t2).join('|') + '|'
            }).join('\n') + '\n');

        return isHit === 'Game over' ?
            isHit + '\ntotal shots: ' + this.totalShot + ', missed shots: ' + this.missedShot : isHit;
    }

    public getStatus() {
        return {
            attackedArea: this.attackedArea,
            shipsPosition: this.fleet.getFleetPosition(),
            allShips: this.fleet.getShips(),
            remainingShip: this.fleet.getRemainingShips(),
            totalShot: this.totalShot,
            missedShot: this.missedShot
        };
    }
}