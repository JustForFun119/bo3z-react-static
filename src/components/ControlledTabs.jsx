import React from 'react'
import PropTypes from 'prop-types'

import Tabs from 'react-bootstrap/lib/Tabs'

export default class ControlledTabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key: 1
        }
    }

    handleSelect(key) {
        console.log('selected ' + key)
        this.setState({ key })
    }

    render() {
        return (
            <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                {this.props.children}
            </Tabs>
        )
    }
}
ControlledTabs.propTypes = {
    children: PropTypes.element
}
