import React, { Component } from 'react'
import { connect } from 'react-redux'

class Cell extends Component {
    render() {
        const {props} = this
        let content = ''
        //console.log(props)
        if (props.x === props.coord_x && props.y === props.coord_y) {
            content = <Robot class={props.movement || props.direction} />
        }

        return (
            <div id={'cell-' + props.x + props.y} className="flex-item">{props.x}, {props.y}{content}</div>
        )
    }
}

function mapStateToProps(state) {
    return {
        coord_x : state.coord_x,
        coord_y : state.coord_y,
        direction : state.direction,
        movement : state.movement
    }
}

Cell = connect(mapStateToProps)(Cell)

class Row extends Component {
    render() {
        const {props} = this
        // props.row * 5 - 4
        let cells = []
        for (let a = 0; a < 5; a++) {
            cells.push(<Cell key={a} y={props.row} x={a} />)
        }

        return (
            <div className="flex-container">
                {cells}
            </div>
        )
    }
}

class Robot extends Component {
    render() {
        const {props} = this

        return (
            <div className="robot-container">
                <img className={"robot " + props.class} src={require('../arrow.png')} />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        place_robot : (robot_data) => dispatch({
            type : 'PLACE',
            payload : robot_data
        }),
        move_robot : () => dispatch({
            type : 'MOVE'
        }),
        turn_robot : (direction) => dispatch({
            type : 'TURN',
            payload : direction
        }),
        save_log : (log) => dispatch({
            type : 'SAVE',
            payload : log
        })
    }
}

class Menu extends Component {
    constructor(props) {
        super(props)
        this.do_action = this.do_action.bind(this)
        this.update_input = this.update_input.bind(this)
        this.check_first_command = this.check_first_command.bind(this)

        this.state = {
            action : ''
        }

        this.PLACE_pattern = /^PLACE \d,\d,(NORTH|EAST|SOUTH|WEST){1,}/
    }

    update_input(e) {
        // Don't forget to trim it first
        this.setState({
            [e.target.name] : e.target.value.trim().toUpperCase()
        })
    }

    check_first_command() {
        const {state} = this

        return this.PLACE_pattern.test(state.action)
    }

    do_action(e) {
        e.preventDefault()
        const {state, props} = this
        let action_type = state.action

        // Check if there's a session already going
        const session = sessionStorage.getItem('interaktiv')
        //console.log(session)

        if (session === null) {
            // Before making a session, check if the first command is valid i.e. it is PLACE
            if ( ! this.check_first_command()) {
                alert(state.action + ' is not a valid first command')
                return
            }

            action_type = 'PLACE'
            // Make the first session with value 1
            sessionStorage.setItem('interaktiv', 1)
        }

        else {
            // Check if the command is PLACE i.e. time to start a new session
            if (this.check_first_command()) {
                // Make a new session and tell the user about it
                alert('Starting a new session')
                sessionStorage.setItem('interaktiv', parseInt(session) + 1)
                action_type = 'PLACE'
            }

            // Otherwise, proceed as usual
        }

        switch(action_type) {
            case 'PLACE':
                // Parse the command e.g. PLACE 1,2,NORTH
                const robot_data = {
                    coord_x : parseInt(state.action.slice(6, 7)),
                    coord_y : parseInt(state.action.slice(8, 9)),
                    direction : state.action.slice(10)
                }

                props.place_robot(robot_data)
                break

            case 'MOVE':
                props.move_robot()
                break

            case 'LEFT':
                props.turn_robot('left')
                break

            case 'RIGHT':
                props.turn_robot('right')
                break

            case 'SAVE':
                break

            default:
                alert(state.action + ' is not a valid command')
        }
    }

    render() {
        return (
            <div className="menu">
                <form onSubmit={this.do_action}>
                    <input type="search" name="action" onChange={this.update_input} autoFocus />&nbsp;
                    <button>DO</button>&nbsp;
                    <button>HELP</button>
                </form>
            </div>
        )
    }
}

Menu = connect(null, mapDispatchToProps)(Menu)

export default class Tabletop extends Component {
    render() {
        let rows = []

        for (let a = 4; a > -1; a--) {
            rows.push(<Row key={a} row={a} />)
        }

        return (
            <div>
                <Menu />
                {rows}
            </div>
        )
    }
}
