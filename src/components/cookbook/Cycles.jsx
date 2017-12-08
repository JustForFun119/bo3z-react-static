import React from 'react';
import PropTypes from 'prop-types';
// React Router 'withRouter' wrap for URL identification
import { withRouter } from 'react-router';
// UI Components
import { formatDateForChip } from '../Cookbook'; // some functions from cookbook page component
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip'; // cycle card : date range chip
import Avatar from 'material-ui/Avatar'; // cycle card : date range chip
import Badge from 'material-ui/Badge'; // cycle card details : gum badge
import IconButton from 'material-ui/IconButton'; // cycle card : show details
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more'; // cycle card : show details
// Data
import moment from 'moment'; // MomentJS
import Gobblegums from '../../data/gobblegums.js'; // Gobblegums data
// import CookbookData from '../../data/cookbook.js' // Cookbook recipes data
import _zip from 'lodash/zip';

const styles = {
    Paper: {
        display: 'block',
        height: 'auto',
        width: '95%',
        margin: 'auto',
        marginTop: 10,
        padding: 12,
        textAlign: 'center',
    },
    CycleCard: {
        Header: {
            Container: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4
            }
        },
        DateChipsContainer: {
            display: 'flex',
            flexFlow: 'row',
            overflowY: 'hidden',
            overflowX: 'auto',
        },
        DateChip: { margin: 4 },
        Details: {
            GumsCarousel: {
                display: 'flex',
                flexFlow: 'row',
                overflowY: 'hidden',
                overflowX: 'auto',
            },
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
        }
    },
};

function CycleCardDetails(props) {
    const detailStyles = styles.CycleCard.Details;

    function getExpandStyle(isExpanded) {
        // TODO: pull styles to SASS and use conditional CSS class instead
        const styleExpanded = {
            visibility: 'visible', opacity: '1', maxHeight: 120,
            transition: 'max-height 0.5s ease-in, opacity 0.5s ease-in 0.25s'
        };
        const styleCollapsed = {
            visibility: 'hidden', opacity: '0', maxHeight: 0,
            transition: 'visibility 0.1s 0.5s, opacity 0.5s ease-out, max-height 0.5s ease-out 0.25s'
        };
        return isExpanded ? styleExpanded : styleCollapsed;
    }

    function getGumAndCountBadges() {
        const gumsCount = {};
        props.cycleDays.map(day => day.recipes.forEach(recipe => {
            const { name: gumName } = recipe.output
            gumsCount[gumName] = gumsCount[gumName] ? gumsCount[gumName] + 1 : 1
        }));
        // sort gums by number of appearance in all recipes
        const sortedGumsCount = Object.keys(gumsCount).map(key => `${key},${gumsCount[key]}`)
            .sort((a, b) => parseInt(b.split(',')[1]) - parseInt(a.split(',')[1]));
        // make Badge with gums and their counts
        return sortedGumsCount.map((gumAndCount, idx) => {
            const [gumName, count] = gumAndCount.split(',');
            let gum = Gobblegums.getGumByName(gumName);
            return (
                <Badge key={idx}
                    badgeContent={count} primary={true} badgeStyle={detailStyles.GumBadge}>
                    <img style={detailStyles.GumImage} src={gum.img} alt={gum.name} />
                </Badge>
            );
        });
    }

    return (
        <div style={getExpandStyle(props.expanded)}>
            <div style={detailStyles.GumsCarousel} className="hideScrollbar">
                {getGumAndCountBadges()}
            </div>
        </div>
    );
}
CycleCardDetails.propTypes = {
    expanded: PropTypes.bool,
    cycleDays: PropTypes.array
};

class CycleCard extends React.Component {
    constructor(props) {
        super(props);
        // Dates of the cycle
        const cycleDates = props.cycleDays.map(day => day.dates);
        const cycleDateRanges = _zip.apply(null, cycleDates) // zip date ranges together
            // clean 'undefined' after zip
            .map(dateRange => dateRange.filter(date => typeof date !== 'undefined'));
        this.state = {
            expanded: props.expanded,
            cycleDateRanges: cycleDateRanges
        };
    }

    expandDetails() {
        console.log('expandDetails');
        this.setState({ expanded: !this.state.expanded }); // toggle 'expanded' state
        console.log('state updated');
        this.props.onCardClick(this.props.cycleNum); // callback to CookbookCycle for URL change
        console.log('onCardClick done');
    }

    getDateRangeChips(dateRanges) {
        // Make date chips strings for showing date ranges as Chips
        let dateRangeObjs;
        if (!this.state.expanded && window.innerWidth < 400) { // unexpanded & small/mobile screen size
            // only show latest date range, with earlier date ranges as one chip
            if (dateRanges.length > 1) {
                // last date range is latest
                let latestDateRange = dateRanges[dateRanges.length - 1];
                // remaining becomes one string/chip
                dateRangeObjs = [getDateRangeObj(latestDateRange),
                { numDays: -1, rangeStr: `+ ${dateRanges.length - 1} more` }];
            }
        } // larger screen size shows all date ranges
        // convert to date chip strings
        dateRangeObjs = dateRangeObjs || dateRanges.map(dateRange => getDateRangeObj(dateRange));
        // Map date strings to Chips
        return dateRangeObjs.map((dateRangeObj, i) =>
            <Chip key={i} style={styles.CycleCard.DateChip}>
                {dateRangeObj.numDays !== -1 && <Avatar>{dateRangeObj.numDays}</Avatar>}
                {dateRangeObj.rangeStr}
            </Chip>
        );

        function getDateRangeObj(dateRange) {
            const startDate = formatDateForChip(moment(dateRange[0]));
            const endDate = formatDateForChip(moment(dateRange[dateRange.length - 1]));
            return {
                rangeStr: `${startDate} - ${endDate}`,
                numDays: dateRange.length
            };
        }
    }

    getDaysAgoOfCycle(dateRanges) {
        const lastDateRange = dateRanges[dateRanges.length - 1];
        const lastDate = lastDateRange[lastDateRange.length - 1];
        return moment(lastDate).calendar(moment());
    }

    getExpandIconStyle() {
        // rotates 'expand' icon on expand/collapse
        return this.state.expanded ? {
            transform: 'rotate(180deg)',
            transition: '0.5s'
        } : {
                transform: 'rotate(0deg)',
                transition: '0.5s'
            };
    }

    render() {
        const totalDaysInCycle = this.state.cycleDateRanges.reduce(
            (total, dateRange) => total + dateRange.length, 0);

        return (
            <Paper style={styles.Paper}>
                <div style={styles.CycleCard.Header.Container}>
                    <Chip>
                        <Avatar>{totalDaysInCycle}</Avatar>
                        Cycle {this.props.cycleNum}
                    </Chip>
                    <span>{this.getDaysAgoOfCycle(this.state.cycleDateRanges)}</span>
                    <IconButton iconStyle={this.getExpandIconStyle()}>
                        <ExpandMore onClick={this.expandDetails.bind(this)} />
                    </IconButton>
                </div>
                <div style={styles.CycleCard.DateChipsContainer} className="hideScrollbar">
                    {this.getDateRangeChips(this.state.cycleDateRanges)}
                </div>
                <CycleCardDetails
                    expanded={this.state.expanded}
                    cycleDays={this.props.cycleDays} />
            </Paper>
        );
    }
}
CycleCard.propTypes = {
    cycleDays: PropTypes.array,
    cycleNum: PropTypes.number,
    expanded: PropTypes.bool,
    onCardClick: PropTypes.func
};

// Cookbook cycles overview
class CookbookCycles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cycles: Object.keys(props.cookbookData)
                .filter(cycleKey => !isNaN(cycleKey)) // filter away non-cycle key-value
                .map(cycleKey => props.cookbookData[cycleKey]), // key-value actual cycle days
            viewCycleNum: -1
        };
        // catch URL parameters (if any)
        this.catchUrlParams(props.match.params);
    }

    componentWillReceiveProps(nextProps) {
        this.catchUrlParams(nextProps.match.params);
    }

    catchUrlParams(urlParams) {
        // expand cycle card from URL 'query' param (if any)
        if (urlParams.query) {
            Object.assign(this.state, { viewCycleNum: urlParams.query });
        }
    }

    onCycleCardClick(cycleNum) {
        this.setState({ viewCycleNum: cycleNum });
        const cycleUrl = '/cookbook/cycles/' + cycleNum;
        if (this.props.history.location.pathname !== cycleUrl)
            this.props.history.push(cycleUrl);
    }

    render() {
        return (
            <div>
                {this.state.cycles.map((cycle, idx) =>
                    <CycleCard
                        key={idx}
                        cycleNum={parseFloat(idx + 1)}
                        cycleDays={cycle}
                        expanded={this.state.viewCycleNum == idx + 1}
                        onCardClick={this.onCycleCardClick.bind(this)} />
                )}
            </div>
        );
    }
}
CookbookCycles.propTypes = {
    cookbookData: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
};

// Wrap component with 'withRouter' from React Router (component will change URL/history state)
export default withRouter(CookbookCycles);