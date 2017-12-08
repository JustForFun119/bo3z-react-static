// React
import React from 'react'
import PropTypes from 'prop-types'
// React Router 'withRouter' wrap for URL identification
import { withRouter } from 'react-router'
// UI Components
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import Dialog from 'material-ui/Dialog' // gum details modal
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
import { RecipeSearchResult } from './cookbook/Search' // recipe peek component (for tablet & larger screens)
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
        super(props);
        this.state = {
            tabIndex: 0
        };
        this.changeTab = this.changeTab.bind(this);
    }

    changeTab(value) {
        this.setState({ tabIndex: value });
    }

    render() {
        const gums = this.props.gums;
        return (
            <div className="grid-container">
                <div>
                    <Tabs value={this.state.tabIndex} onChange={this.changeTab}
                        style={styles.Tabs.Container}>
                        <Tab label="Classic" value={0} />
                        <Tab label="Mega" value={1} />
                    </Tabs>
                    <SwipeableViews index={this.state.tabIndex} onChangeIndex={this.changeTab}>
                        <GumsGrid.Container gums={gums.classic} onGumSelected={this.props.updateSelectedGum} />
                        <GumsGrid.Container gums={gums.mega} onGumSelected={this.props.updateSelectedGum} />
                    </SwipeableViews>
                </div>
            </div>
        );
    }
}
GumsGridControl.propTypes = {
    gums: PropTypes.object,
    updateSelectedGum: PropTypes.func
};

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
};
GumsGrid.Container.propTypes = {
    gums: PropTypes.array,
    onGumSelected: PropTypes.func
};
GumsGrid.Item.propTypes = {
    gum: PropTypes.object,
    onGumSelected: PropTypes.func
};

const ActionSeeRecipe = (props) => (
    <FlatButton
        label="See Recipes"
        primary={true}
        onTouchTap={() => props.goToRecipe(props.gumName)} />
);
ActionSeeRecipe.propTypes = {
    goToRecipe: PropTypes.func,
    gumName: PropTypes.string
};

// Gum Details Dialog View (for mobile)
const GumDetailsDialog = (props) => {
    const { gum } = props;
    const rarity = gum.rarity ? gums.rarity[gum.rarity] : undefined;
    let gumActivateText = gum.activation.match(/(\w+) (\(.*\))/);
    gumActivateText = gumActivateText && gumActivateText.length > 1 ?
        (<span>{gumActivateText[1]}<br />{gumActivateText[2]}</span>) :
        (gum.activation);

    const actions = [];
    // add 'see recipe' action button if gum is of some rarity i.e. not Classic
    if (rarity) {
        actions.push(
            <ActionSeeRecipe key={0}
                goToRecipe={props.goToRecipe}
                gumName={gum.name} />
        );
    }

    return (
        <Dialog
            title={gum.name}
            actions={actions}
            open={props.open}
            contentStyle={styles.Dialog.Content}
            titleStyle={styles.Dialog.Title}
            bodyStyle={styles.Dialog.Body}
            onRequestClose={props.onClose}
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
    );
};
GumDetailsDialog.propTypes = {
    gum: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    goToRecipe: PropTypes.func
};

// Gum Details Card View (for tablet & desktop)
const GumDetailsCard = (props) => {
    const { gum } = props;
    const rarity = gum.rarity ? gums.rarity[gum.rarity] : undefined;
    const style = {
        width: 'auto',
        minWidth: 'auto'
    };

    const actions = [];
    // add 'see recipe' action button if gum is of some rarity i.e. not Classic
    if (rarity) {
        actions.push(
            <ActionSeeRecipe key={0}
                goToRecipe={props.goToRecipe}
                gumName={gum.name} />
        );
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
            <CardActions>{actions}</CardActions>
        </Card>
    );
};
GumDetailsCard.propTypes = {
    gum: PropTypes.object,
    goToRecipe: PropTypes.func
};

// Cookbook recipes peek view for gum (for tablet & desktop)
const GumRecipesPeek = (props) => {
    const { gum } = props

    return (
        <div className="gum-recipes">
            Related Recipes for {gum.name}...
            <RecipeSearchResult
                cookbookData={this.props.cookbookData}
                searchQuery={this.state.searchQuery}
                showRecipeDetails={this.props.showRecipeDetails} />
        </div>
    )
};
GumRecipesPeek.propTypes = {
    gum: PropTypes.object
};

class Gobblegums extends React.Component {
    constructor(props) {
        super(props);
        const { classic, mega, rare, ultra_rare } = gums.tree;
        this.state = {
            gums: {
                classic: [...classic.normal, ...classic.whimsical],
                mega: [...mega, ...rare, ...ultra_rare]
            },
            selectedGum: classic.normal[0],
            dialogIsOpen: false
        };
        // catch 'gum' URL parameter (if any)
        this.catchUrlGumParam(this.props.match.params);
        this.updateSelectedGum = this.updateSelectedGum.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.catchUrlGumParam(nextProps.match.params);
    }

    catchUrlGumParam(urlParams) {
        // Select gum from URL param (if any)
        if (urlParams.gum) {
            const gum = gums.getGumByName(decodeURIComponent(urlParams.gum)); // get gum by decoding name from URL
            if (gum) {
                Object.assign(this.state, { // assign new state if param is caught
                    selectedGum: gum, // set selected gum state
                    // change to tab of gum category, default to first tab
                    tabIndex: gums.getGumCategory(gum) === 'Mega' ? 1 : 0,
                    // show gum details dialog on mobile screen size
                    dialogIsOpen: this.props.screenSize.isMobileXs || this.props.screenSize.isMobile
                });
            }
        }
    }

    updateSelectedGum(gum) {
        this.props.history.push('/gobblegums/' + encodeURIComponent(gum.name));
        this.setState({ selectedGum: gum });
        if (this.props.screenSize.isMobile) { this.openDialog(); }
    }

    goToRecipe(gumName) {
        this.props.history.push('/cookbook/search/gum/' + encodeURIComponent(gumName))
    }

    openDialog() { this.setState({ dialogIsOpen: true }); }

    closeDialog() { this.setState({ dialogIsOpen: false }); }

    render() {
        return (
            <div>
                <GumDetailsCard gum={this.state.selectedGum} goToRecipe={this.goToRecipe.bind(this)} />
                <GumDetailsDialog gum={this.state.selectedGum} goToRecipe={this.goToRecipe.bind(this)}
                    open={this.state.dialogIsOpen} onClose={this.closeDialog.bind(this)} />
                <GumsGridControl gums={this.state.gums} goToRecipe={this.goToRecipe.bind(this)}
                    updateSelectedGum={this.updateSelectedGum.bind(this)} />
                {(this.props.screenSize.isTablet || this.props.screenSize.isDesktop) &&
                    <GumRecipesPeek gum={this.state.selectedGum} />}
            </div>
        );
    }
}
Gobblegums.propTypes = {
    screenSize: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    cookbookData: PropTypes.object
};

// Wrap component that change URL/history state with 'withRouter' from React Router
export default withRouter(Gobblegums);

// helper function: capitalize string TODO: move to another script for clarification
String.prototype.capitalize = function () {
    return this.split(' ').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ');
};