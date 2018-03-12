import { createStore } from "redux"

const EAST = 'robot-transition robot-faces-east'
const WEST = 'robot-transition robot-faces-west'
const SOUTH = 'robot-transition robot-faces-south'
const NORTH = 'robot-transition robot-faces-north'

const default_state = {
    coord_x : '',
    coord_y : '',
    direction : NORTH,
    movement : '',
    log : []
}

const PLACE = 'PLACE'
const MOVE = 'MOVE'
const TURN = 'TURN'
const SAVE = 'SAVE'

function reducer(state = default_state, action) {
    switch (action.type) {
        case PLACE:
            switch (action.payload.direction) {
                case 'NORTH':
                    action.payload.direction = NORTH
                    break
                case 'EAST':
                    action.payload.direction = EAST
                    break
                case 'SOUTH':
                    action.payload.direction = SOUTH
                    break
                case 'WEST':
                    action.payload.direction = WEST
                    break
            }
            return Object.assign({}, state, action.payload)

        case MOVE:
            return Object.assign({}, state, {movement : 'robot-transition robot-moves'})

        case TURN:
            let new_direction = ''
            switch (state.direction) {
                case EAST:
                    new_direction = action.payload === 'right' ? SOUTH : NORTH
                    break

                case SOUTH:
                    new_direction = action.payload === 'right' ? WEST : EAST
                    break

                case WEST:
                    new_direction = action.payload === 'right' ? NORTH :SOUTH
                    break

                case NORTH:
                    new_direction = action.payload === 'right' ? EAST : WEST
                    break
            }

            return Object.assign({}, state, {direction : new_direction})

        default:
            return state
    }
}

const store = createStore(reducer)

export default store
