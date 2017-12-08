// React
import React from 'react'
import PropTypes from 'prop-types'
// React Router
import { withRouter } from 'react-router-dom'
// UI Components
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import Dialog from 'material-ui/Dialog'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
// Style
import style from '!style-loader!css-loader!sass-loader!../sass/gobblegums.scss' // SCSS stylesheet
const styles = {
    Tabs: {
        Container: {
            position: 'sticky',
            top: 64,
            zIndex: 1
        }
    },
    Dialog: {
        Content: {
            width: '80%'
        },
        Title: {
            padding: '12px 18px',
            fontSize: '16px'
        },
        Body: {
            padding: '0 16px 24px'
        }
    }
}
// Data
import gums from '../data/gobblegums.js' // Gobblegums data
const gum_rarity_styles = {
    whimsical: { fontColor: 'aqua' },
    mega: { fontColor: '#66FF66' },
    rare: { fontColor: 'yellow' },
    ultra_rare: { fontColor: '#FF6EFF' }
}

class GumsGridControl extends React.Component {
    constructor(props) {
        super(props)
        const { classic, mega, rare, ultra_rare } = props.gums
        this.state = {
            gums: {
                classic: [...classic.normal, ...classic.whimsical],
                mega: [...mega, ...rare, ...ultra_rare]
            },
            selectedGum: classic.normal[0],
            tabIndex: 0,
            dialogIsOpen: false
        }
        // catch 'gum' URL param (if any)
        this.catchUrlGumParam(this.props)
        this.updateSelectedGum = this.updateSelectedGum.bind(this)
        this.changeTab = this.changeTab.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.closeDialog = this.closeDialog.bind(this)
        this.goToRecipe = this.goToRecipe.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.catchUrlGumParam(nextProps)
    }

    catchUrlGumParam(props) {
        const { gum: urlParamGum } = props.match.params
        // Select gum from URL param (if any)
        if (urlParamGum) {
            const gum = gums.getGumByName(decodeURIComponent(urlParamGum)) // get gum by decoding name from URL
            if (gum) {
                Object.assign(this.state, { // assign new state if param is caught
                    selectedGum: gum, // set selected gum state
                    // change to tab of gum category, default to first tab
                    tabIndex: gums.getGumCategory(gum) === 'Mega' ? 1 : 0,
                    // show gum details dialog on mobile screen size
                    dialogIsOpen: this.props.screenSize.isMobileXs || this.props.screenSize.isMobile
                })
            }
        }
    }

    updateSelectedGum(gum) {
        this.props.history.push('/gobblegums/' + encodeURIComponent(gum.name))
        this.setState({ selectedGum: gum })
        if (this.props.screenSize.isMobile) { this.openDialog() }
    }

    changeTab(value) {
        this.setState({ tabIndex: value })
    }

    openDialog() {
        this.setState({ dialogIsOpen: true })
    }

    closeDialog() {
        this.setState({ dialogIsOpen: false })
    }

    goToRecipe(gumName) {
        console.log('Go to recipe of %s', gumName)
    }

    render() {
        const selectedGum = this.state.selectedGum
        const classicGums = this.state.gums.classic
        const megaGums = this.state.gums.mega
        return (
            <div className="grid-container">
                <GumDetailsCard gum={selectedGum} seeRecipe={this.goToRecipe} />
                <GumDetailsDialog gum={selectedGum} seeRecipe={this.goToRecipe}
                    open={this.state.dialogIsOpen} onClose={this.closeDialog} />
                <Tabs value={this.state.tabIndex} onChange={this.changeTab}
                    style={styles.Tabs.Container}>
                    <Tab label="Classic" value={0} />
                    <Tab label="Mega" value={1} />
                </Tabs>
                <SwipeableViews index={this.state.tabIndex} onChangeIndex={this.changeTab}>
                    <GumsGrid.Container gums={classicGums}
                        onGumSelected={this.updateSelectedGum} />
                    <GumsGrid.Container gums={megaGums}
                        onGumSelected={this.updateSelectedGum} />
                </SwipeableViews>
                {(this.props.screenSize.isTablet || this.props.screenSize.isDesktop) &&
                    <GumRecipesPeek gum={selectedGum} />}
            </div>
        )
    }
}
GumsGridControl.propTypes = {
    screenSize: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    gums: PropTypes.object
}

const GumsGrid = {
    Container: (props) => (
        <div className="gums-grid">
            {props.gums.map(gum => <GumsGrid.Item
                key={gum.name} gum={gum} onGumSelected={props.onGumSelected} />)}
        </div>
    ),
    Item: (props) => {
        const gum = props.gum
        const onGumSelected = props.onGumSelected
        const onImageError = (el) => {
            el.target.onError = ''
            el.target.src = 'img/gg/gg_locked.png'
            return true
        }
        return (
            <div className="item">
                <div className="gum-container">
                    <img src={gum.img} alt={gum.name}
                        onClick={() => onGumSelected(gum)}
                        onError={onImageError} />
                </div>
            </div>
        )
    }
}
GumsGrid.Container.propTypes = {
    gums: PropTypes.array,
    onGumSelected: PropTypes.func
}
GumsGrid.Item.propTypes = {
    gum: PropTypes.object,
    onGumSelected: PropTypes.func
}

// Gum Details Dialog View (for mobile)
const GumDetailsDialog = (props) => {
    const { gum } = props
    const rarity = gum.rarity ? gums.rarity[gum.rarity] : undefined
    let gumActivateText = gum.activation.match(/(\w+) (\(.*\))/)
    gumActivateText = gumActivateText && gumActivateText.length > 1 ?
        (<span>{gumActivateText[1]}<br />{gumActivateText[2]}</span>) :
        (gum.activation)

    const actions = [
        <FlatButton
            key={0}
            label="Close"
            primary={true}
            onTouchTap={props.onClose} />,
        <FlatButton
            key={1}
            label="See Recipes"
            secondary={true}
            onTouchTap={() => props.seeRecipe(gum.name)} />
    ]

    return (
        <Dialog
            title={gum.name}
            actions={actions}
            open={props.open}
            contentStyle={styles.Dialog.Content}
            titleStyle={styles.Dialog.Title}
            bodyStyle={styles.Dialog.Body}
            autoScrollBodyContent={true}>
            <div className="gum-details-dialog">
                <div className="gum-text">
                    <div className="gum-name">{gum.name}</div>
                    <div className="gum-desc">
                        {rarity && <p className={"gum-rarity " + rarity.style}>{rarity.text}</p>}
                        <p className="gum-activation">{gumActivateText}</p>
                        <p className="gum-effects">{gum.effects}</p>
                    </div>
                </div>
                <div className="gum-img">
                    <img src={gum.img} alt={gum.name} />
                </div>
            </div>
        </Dialog>
    )
}
GumDetailsDialog.propTypes = {
    gum: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    seeRecipe: PropTypes.func
}

// Gum Details Card View (for tablet & desktop)
const GumDetailsCard = (props) => {
    const { gum } = props
    const rarity = gum.rarity ? gums.rarity[gum.rarity] : undefined
    const style = {
        width: 'auto',
        minWidth: 'auto'
    }
    return (
        <Card className="gum-details-card">
            {rarity ?
                (<CardHeader
                    title={rarity.text}
                    titleStyle={gum_rarity_styles[gum.rarity]} />) :
                (<CardHeader />)}
            <CardMedia className="gum-img">
                <img src={gum.img} alt={gum.name} style={style} />
            </CardMedia>
            <CardTitle title={gum.name} subtitle={gum.activation} />
            <CardText>{gum.effects}</CardText>
        </Card>
    )
}
GumDetailsCard.propTypes = {
    gum: PropTypes.object
}

// Cookbook recipes peek view for gum (for tablet & desktop)
const GumRecipesPeek = (props) => {
    const { gum } = props

    return (
        <div className="gum-recipes">
            Related Recipes for {gum.name}...
        </div>
    )
}
GumRecipesPeek.propTypes = {
    gum: PropTypes.object
}

// Wrap component that change URL/history state with 'withRouter' from React Router
const GumsGridControlRouter = withRouter(GumsGridControl)

export default class Gobblegums extends React.Component {
    render() {
        return (
            <div>
                <GumsGridControlRouter
                    screenSize={this.props.screenSize}
                    gums={gums.map} />
            </div>
        )
    }
}
Gobblegums.propTypes = {
    screenSize: PropTypes.object
}