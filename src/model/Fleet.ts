import Ship from "./Ship";

export default class Fleet {
    //Is ship allow to be placed next to each other? default is no
    private allowAdjacent = process.env.allow_adjacent || false;
    private ships: Ship[] = [];
    private position: string[][];

    constructor(ships: { [key: string]: number; }, size: [number, number]) {
        for (let shipType of Object.keys(ships)) {
            for (let i = 0; i < ships[shipType]; i++) {
                this.ships.push(new Ship(shipType, i));
            }
        }

        //initiate position
        this.position = [];
        for (var i: number = 0; i < size[1]; i++) {
            this.position[i] = [];
            for (var j: number = 0; j < size[0]; j++) {
                this.position[i][j] = '';
            }
        }
    }

    public placeShip(shipType: string, posX: number, posY: number, direction: 'horizontally' | 'vertically') {
        const ship = this.getAvailableShipByType(shipType);
        if (ship) {
            if (this.isPlacable(ship, posX, posY, direction)) {
                for (let i = 0; i < ship.getHealth(); i++) {
                    if (direction === "horizontally") {
                        this.position[posY][posX + i] = ship.getType() + ship.no;
                    } else {
                        this.position[posY + i][posX] = ship.getType() + ship.no;
                    }
                }
                ship.isPlaced = true;

                console.log('Ships\' postion\n' +
                    this.position.map((t1) => {
                        return '|' + t1.map((t2) => t2 === '' ? ' ' : t2.charAt(0)).join('|') + '|'
                    }).join('\n') + '\n');

                return 'placed';
            } else {
                throw new Error('ship cannot be placed');
            }
        } else {
            throw new Error('No available ship of this type to be placed');
        }
    }

    private isPlacable(ship: Ship, posX: number, posY: number, direction: 'horizontally' | 'vertically') {
        for (let i = 0; i < ship.getHealth(); i++) {
            if (direction === "horizontally") {
                if (this.position[posY][posX + i] !== '') return false;
                if (!this.allowAdjacent) {
                    if (!this.isAdjacentlySafeToPlace(posX + i, posY)) return false;
                }
            } else {
                if (this.position[posY + i][posX] !== '') return false;
                if (!this.allowAdjacent) {
                    if (!this.isAdjacentlySafeToPlace(posX, posY + i)) return false;
                }
            }
        }
        return true;
    }

    private isAdjacentlySafeToPlace(posX: number, posY: number): boolean {
        return (this.isOutOfBound(posX - 1, posY - 1) || this.position[posY - 1][posX - 1] === '')
            && (this.isOutOfBound(posX, posY - 1) || this.position[posY - 1][posX] === '')
            && (this.isOutOfBound(posX + 1, posY - 1) || this.position[posY - 1][posX + 1] === '')
            && (this.isOutOfBound(posX - 1, posY) || this.position[posY][posX - 1] === '')
            && (this.isOutOfBound(posX + 1, posY) || this.position[posY][posX + 1] === '')
            && (this.isOutOfBound(posX - 1, posY + 1) || this.position[posY + 1][posX - 1] === '')
            && (this.isOutOfBound(posX, posY + 1) || this.position[posY + 1][posX] === '')
            && (this.isOutOfBound(posX + 1, posY + 1) || this.position[posY + 1][posX + 1] === '')

    }

    private isOutOfBound(posX: number, posY: number) {
        return posY < 0 || posY >= this.position.length || posX < 0 || posX >= this.position[posY].length;
    }

    private getAvailableShipByType(shipType: string): Ship | null {
        for (let ship of this.ships) {
            if (ship.getType() === shipType.toLowerCase() && !ship.isPlaced) {
                return ship;
            }
        }
        return null;
    }

    public isHit(posX: number, posY: number) {
        if (this.isOutOfBound(posX, posY)) throw new Error('Invalid position');

        if (this.position[posY][posX] !== '') {
            const shipType = this.position[posY][posX].substring(0, this.position[posY][posX].length - 1);
            const shipNo = parseInt(this.position[posY][posX].substring(this.position[posY][posX].length - 1));
            const ship = this.getShip(shipType, shipNo);
            if (ship) {
                ship.getAttacked();
                return this.AreAllShipsSunk() ? "Game over" :
                    ship.isSunk ? 'You just sank the ' + ship.getType() : 'Hit';
            } else {
                throw new Error('No ship, something wrong!!!')
            }
        } else {
            return 'Miss';
        }
    }

    public isAllShipsPlaced() {
        let result = true
        for (let ship of this.ships) {
            result = result && ship.isPlaced;
        }
        return result;
    }

    public getShip(shipType: string, shipNo: number) {
        for (let ship of this.ships) {
            if (ship.no === shipNo && ship.getType() === shipType) {
                return ship;
            }
        }
        return null;
    }

    public getShips() {
        return this.ships;
    }

    public getFleetPosition() {
        return this.position;
    }

    public getRemainingShips() {
        const result: { [key: string]: number } = {};
        for (let ship of this.ships) {
            if (ship.isPlaced && !ship.isSunk) {
                result[ship.getType()] ? result[ship.getType()]++ : result[ship.getType()] = 0;
            }
        }
        return result;
    }

    public AreAllShipsSunk() {
        const remainingShips = this.getRemainingShips();

        let result = 0;

        for (let shipType of Object.keys(remainingShips)) {
            result += remainingShips[shipType];
        }
        return result === 0;
    }
}