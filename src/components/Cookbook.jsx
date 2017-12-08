import React from 'react';
import PropTypes from 'prop-types';
// React Router 'withRouter' wrap for URL identification
import { withRouter } from 'react-router';
// UI components
import CookbookSearch from './cookbook/Search'; // cookbook search component
import CookbookCycles from './cookbook/Cycles'; // cookbook cycles component
import { Mobile, MobileXs, getScreenSize } from './ResponsiveDevice'; // react-responsive
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon'; // tab icons
import Badge from 'material-ui/Badge'; // recipe gum count
import Chip from 'material-ui/Chip'; // recipe dates
import Dialog from 'material-ui/Dialog'; // recipe details modal
import Divider from 'material-ui/Divider'; // recipe details modal : recipes divider
import FlatButton from 'material-ui/FlatButton'; // Cookbook data : unavailable retry button
// Style
import style from '!style-loader!css-loader!sass-loader!../sass/cookbook.scss';
// App Data
import CookbookData from '../data/cookbook.js'; // Cookbook recipes data
import Gobblegums from '../data/gobblegums.js'; // Gobblegums data
// Libraries
import moment from 'moment'; // MomentJS
// tab icons
const featuredIcon = <FontIcon className="material-icons">star</FontIcon>;
const searchIcon = <FontIcon className="material-icons">search</FontIcon>;
const cyclesIcon = <FontIcon className="material-icons">all_inclusive</FontIcon>;
const refreshIcon = <FontIcon className="material-icons">refresh</FontIcon>;

// Inline styles & values
const styleValues = {
    Recipe: {
        ArrowColor: '#6B6B6B',
        GumImageSize: {
            MobileXs: 64,
            Mobile: 82,
            Tablet: 96,
            Desktop: 96
        },
        GumBadgeSize: {
            MobileXs: 24,
            Mobile: 24,
            Tablet: 32,
            Desktop: 32
        }
    }
};
const styles = {
    Tabs: {
        Container: {
            position: 'sticky',
            top: 64,
            zIndex: 2 // to overlap most other elements e.g. Chip
        }
    },
    CookbookDay: {
        Recipe: {
            GumImage: {
                maxWidth: 64,
                maxHeight: 64,
            },
            GumBadge: {
                top: 8,
                right: 8,
                width: 24,
                height: 24,
                fontSize: 16
            },
            Paper: {
                display: 'block',
                height: 'auto',
                width: 'auto',
                margin: '0 8px',
                textAlign: 'center',
            }
        },
        RecipeDates: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // or 'baseline' for more top padding for card
            marginBottom: 4
        },
        DateChipsContainer: {
            display: 'flex',
            flexFlow: 'row wrap',
            width: '60%'
        },
        RecipeDateRelative: {
            fontSize: 18,
            width: '35%'
        },
        DateChip: { margin: 4 },
        RecipesContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%'
        },
        Paper: {
            display: 'block',
            height: 'auto',
            width: '95%',
            margin: 'auto',
            marginTop: 10,
            padding: 10,
            textAlign: 'center',
        }
    },
    Modal: {
        Content: {
            width: '90%'
        },
        Body: {
            padding: '0 16px 24px'
        }
    }
};

const RightArrow = () => (
    <svg width="100%" viewBox="0 0 100 20">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10"
                refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="black" />
            </marker>
        </defs>
        <line x1="0" y1="10" x2="60" y2="10" stroke="black" strokeWidth="3"
            markerEnd="url(#arrow)" />
    </svg>
);

const CookbookRecipe = (props) => {
    const recipeStyles = styles.CookbookDay.Recipe;
    // gum data to item component/element
    const toGumItem = (recipeGum, idx) => {
        let gum = Gobblegums.getGumByName(recipeGum.name);
        return (
            <Badge key={idx && ('item' + idx)}
                badgeContent={recipeGum.count} primary={true} badgeStyle={recipeStyles.GumBadge}>
                <img style={recipeStyles.GumImage} src={gum.img} alt={recipeGum.name} />
            </Badge>
        );
    };
    const inlineStyles = {
        Container: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
        Inputs: { display: 'flex' }
    };
    if (props.modalView && window.innerWidth < 400) {
        inlineStyles.Inputs.flexDirection = 'column';
        inlineStyles.Inputs.width = '40%';
    }

    return (
        <div style={props.modalView && inlineStyles.Container}>
            { // also show gum input
                !props.outputOnly &&
                <div style={inlineStyles.Inputs}>{props.recipe.inputs.map(toGumItem)}</div>
            }
            {!props.outputOnly && <div><RightArrow /></div>}
            <div>{toGumItem(props.recipe.output)}</div>
        </div>
    );
};
CookbookRecipe.propTypes = {
    recipe: PropTypes.object,
    outputOnly: PropTypes.bool,
    modalView: PropTypes.bool
};
// Highlight recipe of a day // TODO: method of highlighting recipe TBD
const RecipeHighlight = (props) => (
    <Paper>
        <CookbookRecipe {...props} />
    </Paper>
);

export function formatDateForChip(dateMoment) {
    // date format: '(month) (day)' if date is in this year, else '(day) (month) (year)'
    let dateStr = dateMoment.format(
        dateMoment.isSame(moment(), 'year') ? 'MMM D' : 'D MMM YYYY'); // format dates
    // use italic text for future date
    if (dateMoment.isAfter(moment())) dateStr = <i>{dateStr}</i>;
    return dateStr;
}
// Convert recipe dates to formatted strings
function getDateChipStrings(dates) { return dates.map(date => formatDateForChip(moment(date))); }

function getRelativeDate(date) {
    const now = moment(), fromNowTo = toMoment => toMoment.calendar(now);
    // display different relative date for different dates
    if (date.isSame(now, 'day')) { // recipe date is same as today
        // show 'Today (ends [time left until tomorrow])'
        return <span>Today <span style={{ fontSize: 14 }}>ends {
            CookbookData.UpdateMoment.fromNow()}</span></span>;
    } else if (date.isAfter(now, 'day')) { // date is in the future
        return <i>{fromNowTo(date).capitalize()}</i>; // show date in italic
    } else { // date is history: show time passed from date
        return fromNowTo(date);
    }
}
// Get key date among dates: 'key' being:
// 1. next/projected date in future; or
// 2. latest date in the past
// For a recipe, either the next date or previous featured date is the most interesting
function getKeyDate(dates) {
    // hours from today to recipe dates
    const hourDiffs = dates.map(date => moment(date).diff(moment(), 'hours'));
    // key recipe date is shown with priority on cookbook day card
    const keyDate = hourDiffs.reduce((keyDate, hourDiff, idx) => {
        // date is closer if (hours difference < that of current closest date)
        const dateIsCloser = hourDiff > 0 && hourDiff < keyDate.hourDiff;
        return {
            hourDiff: dateIsCloser ? hourDiff : keyDate.hourDiff,
            idx: dateIsCloser ? idx : keyDate.idx // index for result
        };
    }, { hourDiff: 999, idx: dates.length - 1 });
    // init reducer with large hour difference; and use last date as 'featured' date
    return dates[keyDate.idx];
}

export function CookbookDay(props) {
    function getDateChips(dates, selectedDate) {
        // Make date strings for showing recipe dates as Chips
        let dateStrs;
        if (window.innerWidth < 400) { // small/mobile screen size
            // only show latest date, with earlier dates as one chip
            if (dates.length > 1) {
                let latestDate = dates[dates.length - 1]; // last date is latest
                if (selectedDate) {
                    latestDate = dates.find(date =>
                        moment(date).isSame(moment(selectedDate), 'day'));
                }
                latestDate = formatDateForChip(moment(latestDate));
                dateStrs = [latestDate, `+ ${dates.length - 1} more`]; // remaining becomes one string/chip
            }
        } // larger screen size shows all dates
        dateStrs = dateStrs || getDateChipStrings(dates); // convert to date chip strings
        // Map date strings to Chips
        return dateStrs.map((str, i) =>
            <Chip key={i} style={styles.CookbookDay.DateChip}>{str}</Chip>);
    }

    const {
        Paper: paperStyles,
        RecipesContainer: containerStyles,
        RecipeDates: recipeDatesStyles,
        RecipeDateRelative: recipeDateRelativeStyles,
    } = styles.CookbookDay;
    const recipeIndices = props.recipeHighlightIndices;

    return (
        <Paper style={paperStyles}
            onClick={e => { props.showRecipeDetails(props.recipes[0]) }}>
            <div style={recipeDatesStyles}>
                <span style={styles.CookbookDay.DateChipsContainer}>
                    {getDateChips(props.dates, props.selectedDate)}
                </span>
                <div style={recipeDateRelativeStyles}>
                    {getRelativeDate(moment(props.selectedDate || getKeyDate(props.dates)))}
                </div>
            </div>
            <div style={containerStyles}>
                {props.recipes.map((recipe, idx) =>
                    recipeIndices && recipeIndices.indexOf(idx) >= 0 ?
                        <RecipeHighlight key={'recipe' + idx}
                            recipe={recipe} outputOnly={true} /> :
                        <CookbookRecipe key={'recipe' + idx}
                            recipe={recipe} outputOnly={true} />)}
            </div>
        </Paper>
    );
}
CookbookDay.propTypes = {
    selectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    dates: PropTypes.array,
    recipes: PropTypes.array,
    recipeHighlightIndices: PropTypes.array,
    showRecipeDetails: PropTypes.func
}
// Popup modal showing details of cookbook day
const CookbookDayModal = (props) => {
    if (props.day) {
        const dates = props.day.dates;
        const modalHeader = (
            <div>
                <div style={{ fontSize: 18, textAlign: 'center' }}>
                    {getRelativeDate(moment(dates[dates.length - 1]))}
                </div>
                <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
                    {getDateChipStrings(dates).map((str, i) =>
                        <Chip key={i} style={styles.CookbookDay.DateChip}>{str}</Chip>)}
                </div>
            </div>
        );

        return (
            <Dialog
                open={props.open}
                title={modalHeader}
                titleStyle={{ padding: 16 }}
                contentStyle={styles.Modal.Content}
                bodyStyle={styles.Modal.Body}
                autoScrollBodyContent={true}
                onRequestClose={props.onClose}>
                <div>
                    {props.day.recipes.map((recipe, idx) =>
                        <div key={idx}>
                            <CookbookRecipe key={'recipe' + idx}
                                recipe={recipe} outputOnly={false} modalView={true} />
                            {idx < props.day.recipes.length - 1 && <Divider />}
                        </div>
                    )}
                </div>
            </Dialog>
        );
    }
    return null;
}
CookbookDayModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    day: PropTypes.object
}
// Featured cookbook info: recipes of today & 'predicted' recipes in upcoming week
const CookbookFeatured = (props) => {
    // cookbook featured: days of recipes between yesterday and day in a week later
    const yesterday = moment().add(-1, 'days');
    const aWeekLater = moment().add(7, 'days');
    const aWeekEarlier = moment().add(-7, 'days');
    let featuredDays = CookbookData.GetDays(props.cookbookData, dates =>
        dates.find(date => moment(date).isBetween(yesterday, aWeekLater, 'day')));
    const days = featuredDays && featuredDays.length > 0 ? featuredDays : // show future days
        // or show days of past week
        CookbookData.GetDays(props.cookbookData, dates =>
            dates.find(date => moment(date).isBetween(aWeekEarlier, moment(), 'day'))).reverse();

    return (
        <div>
            {days.map((day, idx) =>
                <CookbookDay key={idx} dates={day.dates} recipes={day.recipes}
                    selectedDate={getKeyDate(day.dates)}
                    showRecipeDetails={props.showRecipeDetails} />)}
        </div>
    );
}
CookbookFeatured.propTypes = {
    cookbookData: PropTypes.object,
    showRecipeDetails: PropTypes.func
}

class Cookbook extends React.Component {
    constructor(props) {
        super(props);
        // catch URL parameters (if any)
        const tabIndex = this.catchUrlParams(props.match.params);
        this.state = {
            tabIndex: tabIndex,
            cookbookData: props.cookbookData,
            modal: {
                open: false,
                day: null
            }
        };
        this.setRecipeGumImageSize(); // set init recipe gum image size
        this.showRecipeModal = this.showRecipeModal.bind(this);
        this.closeRecipeModal = this.closeRecipeModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const state = {};
        // cookbook data state-to-prop
        if (nextProps.cookbookData) state.cookbookData = nextProps.cookbookData;
        // URL parameter links to tab index
        const tabIndex = this.catchUrlParams(nextProps.match.params);
        if (tabIndex) state.tabIndex = tabIndex;
        this.setState(state); // update state
    }

    componentWillUpdate() {
        this.setRecipeGumImageSize(); // resize recipe gum image to screen size
    }

    catchUrlParams(urlParams) {
        // Change to tab from URL param (if any)
        if (urlParams.tab) {
            // TODO: refactor tabs
            const tabIndex = ['featured', 'search', 'cycles'].indexOf(decodeURIComponent(urlParams.tab));
            return tabIndex;
        }
    }

    // TODO: let SASS do image sizing?
    setRecipeGumImageSize() {
        const screenSize = getScreenSize();
        const { GumImageSize } = styleValues.Recipe;
        styles.CookbookDay.Recipe.GumImage.maxWidth = GumImageSize[screenSize];
        styles.CookbookDay.Recipe.GumImage.maxHeight = GumImageSize[screenSize];
    }

    changeTab(index, event, tab) {
        this.setState({ tabIndex: index });
        this.props.history.push('/cookbook' + tab.props['data-route']); // TODO: improve URL nav for tab change
    }

    shouldShowTabIcon() { return window.innerHeight > 512; }

    showRecipeModal(recipe) {
        const cookbookData = this.state.cookbookData;
        const { cycleId, recipeDayId } = recipe;
        const foundDay = CookbookData.SearchBy.CycleDay(cookbookData, cycleId, recipeDayId);
        if (foundDay) {
            this.setState({
                modal: {
                    open: true,
                    day: foundDay
                }
            });
        }
    }

    closeRecipeModal() {
        // TODO: missing close transition?
        this.setState({ modal: { open: false } });
    }

    render() {
        const cookbookData = this.state.cookbookData;

        if (cookbookData) {
            return (
                <div>
                    <CookbookDayModal
                        open={this.state.modal.open}
                        onClose={this.closeRecipeModal}
                        day={this.state.modal.day} />
                    <Tabs value={this.state.tabIndex} onChange={this.changeTab.bind(this)}
                        tabItemContainerStyle={styles.Tabs.Container}
                        contentContainerStyle={{ paddingBottom: 10 }}>
                        <Tab label="Featured" data-route="/featured" value={0}
                            icon={this.shouldShowTabIcon() && featuredIcon}>
                            <CookbookFeatured
                                cookbookData={cookbookData}
                                showRecipeDetails={this.showRecipeModal} />
                        </Tab>
                        <Tab label="Search" data-route="/search" value={1}
                            icon={this.shouldShowTabIcon() && searchIcon}>
                            <CookbookSearch
                                match={this.props.match}
                                history={this.props.history}
                                cookbookData={cookbookData}
                                showRecipeDetails={this.showRecipeModal}
                            />
                        </Tab>
                        <Tab label="Cycles" data-route="/cycles" value={2}
                            icon={this.shouldShowTabIcon() && cyclesIcon}>
                            <CookbookCycles cookbookData={cookbookData} />
                        </Tab>
                    </Tabs>
                </div>
            );
        } else { // data not available, prompt user to retry manually
            return (
                <div className="centerPseudo" style={{ width: '100%', height: 420 }}>
                    <Paper className="centerPseudo" style={{ padding: 24 }}>
                        <div>{"Cookbook Data Not Available..."}</div>
                        <FlatButton label="Retry" labelPosition="before"
                            icon={refreshIcon} primary={true} style={{ marginTop: 16 }}
                            onClick={e => { window.location.reload(); }} />
                    </Paper>
                </div>
            );
        }
    }
}
Cookbook.propTypes = {
    screenSize: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    cookbookData: PropTypes.object
};

// Wrap component with 'withRouter' from React Router (component will change URL/history state)
export default withRouter(Cookbook);
