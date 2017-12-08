// @ts-check
import moment from 'moment'
import gobblegums from './gobblegums.js'

// constants
const cookbook_update_moment = moment("00 00 00", "HH mm ss") // time until cookbook update
const cookbook_update_moment_str = moment().format("MMMM Do YYYY, h:mm:ss a")
console.log('Time now: %s', cookbook_update_moment_str);

// set MomentJS locale
moment.updateLocale('en',
    // @ts-ignore
    {
        calendar: {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: function (now) {
                return `[${now.to(this)}]`
            }
        },
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            ss: '%d seconds',
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours"
        }
    })

// show time left until next cookbook update
function setTimeUntilUpdate() {
    var moment_until_update = moment(cookbook_update_moment.diff(moment()))
    var update_moment_str = moment_until_update.format("hh mm ss")
    update_moment_str = update_moment_str.split(" ").map((t, i) => t += ['h', 'm', 's'][i]).join(" ")
}

// Cookbook data from online Google Sheets file
let key = "1zpMpR7deHB4fQByw45g7mVzTo0iE17lSmDeu66XpXyQ", // key for Google Sheets file
    query = "&tqx=out:json", // query
    gsheets_csv_url = "https://spreadsheets.google.com/tq?key=" + key + query // CORS-enabled server
var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = gsheets_csv_url
// Cookbook data handler (download & parse)
const SESSION_STORAGE_KEY = 'bo3z_cb_data'
const cookbookData = {
    fetch: () => {
        return new Promise((resolve, reject) => {
            get(proxyUrl + targetUrl).then(res => {
                // grab gsheets data from response text
                let content = res.match(/google\.visualization\.Query\.setResponse\((.*)\);/)
                if (content[1]) resolve(JSON.parse(content[1]))
                else reject('Invalid data')
            }).catch(err => { reject(err) })
        })
    },
    parse: (jsonResult, updateProgress) => {
        let cookbookDataRaw = jsonResult.table
        return new Promise((resolve, reject) => {
            let cookbookData = parseRecipesJson(cookbookDataRaw, (rowsParsed, total) => {
                updateProgress(Math.round(rowsParsed / total * 100)) // convert to percentage
            })
            let saved = saveToSession(cookbookData)
            console.log('cookbookData.parse: recipes data', (saved ? '' : 'NOT') + ' SAVED');
            resolve(cookbookData)
            // TODO: any reject condition? detect parse error?
        })

        function saveToSession(cookbookData) {
            if (window.sessionStorage) { // check session storage availability
                let dataJsonStr = JSON.stringify(cookbookData) // stringify JSON data
                window.sessionStorage.setItem(SESSION_STORAGE_KEY, dataJsonStr) // store data in storage
                return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === dataJsonStr // validate stored data
            }
            return false // fail as session storage is not available
        }
    },
    loadFromSession: () => {
        let dataJsonStr = window.sessionStorage.getItem(SESSION_STORAGE_KEY) // get data from sessionStorage
        return dataJsonStr ? JSON.parse(dataJsonStr) : false // parse JSON data from storage, or just fail
    }
}
// exported function for loading cookbook data
function loadCookbookData(onDownloading, onParsing, updateParseProgress) {
    const storedData = cookbookData.loadFromSession() // check & load from sessionStorage
    if (storedData) { // stored data found: immediately resolve
        console.log('cookbook.loadCookbookData: data found in sessionStorage!');
        return new Promise(resolve => { resolve(storedData) })
    } else { // no data in storage: download and parse online data
        console.log('cookbook.loadCookbookData: no data in sessionStorage; downloading data...');
        return new Promise((resolve, reject) => {
            onDownloading()
            cookbookData.fetch().then(jsonResult => { // fetch/download cookbook data
                onParsing()
                cookbookData.parse(jsonResult, updateParseProgress) // parse cookbook data
                    .then(resolve) // data obtained!
                    .catch(reject) // something went wrong!
            }).catch(reject) // something went wrong!
        })
    }
}
// exported function for flattening cookbook data into array of all cycles
function getCookbookCycles(cookbookData) {
    // get all cycles from cookbook object (flat map cycles with Array.reduce() using object keys)
    return Object.keys(cookbookData).reduce(
        (cycles, cycleKey) => cycles.concat(cookbookData[cycleKey]), []).slice(0, -1)
    // remove last item: 'cookbookData.lastCycle' (key for last cycle in cookbook object)
}
function getCookbookDays(cookbookData, datesFilter) {
    // get all cookbook cycles; find days given a predicate
    return getCookbookCycles(cookbookData).map(day => ({
        date: datesFilter(day.dates),
        dayRef: day // hold a reference to the 'day' object
    })).filter(day => day.date) // filter: keep desired days
        .sort((a, b) => moment(a.date).diff(moment(b.date), 'day')) // sort in chronological order
        .map(day => day.dayRef) // map back to original 'day' object
}
export { loadCookbookData, getCookbookDays }

function parseRecipesJson(json, updateProgress) {
    console.log('Recipes loaded %o : %s rows', json, json.rows.length)
    let cycles = {}, dayOfCycle = { dates: [], recipes: [] }, recipe
    let lastCycle = 0, rowsDone = 0, recipeCount = 0
    for (let row of json.rows) {
        let [numCycle, numRecipe,
            input1_count, input1_item,
            input2_count, input2_item,
            input3_count, input3_item,
            output_count, output_item, ...dates] = row.c.map(item => item ? item.f || item.v : null)
        if (numCycle) { // cycle number check; ignore otherwise (not valid recipe data)
            if (numCycle > lastCycle) lastCycle = numCycle // mark as last cycle if later than previous
            // init the cycle array
            if (!Array.isArray(cycles[numCycle])) cycles[numCycle] = []
            // add dates of the recipe to 'day of cycle'
            for (let date of dates) if (date && recipeCount === 0) dayOfCycle.dates.push(moment(date))
            // init recipe object
            recipe = { cycleId: numCycle, recipeDayId: numRecipe, inputs: [], output: {} }
            // Process & populate recipe I/O
            // add gum input to recipe
            if (input1_count && input1_item) recipe.inputs.push({ name: input1_item, count: parseInt(input1_count) })
            if (input2_count && input2_item) recipe.inputs.push({ name: input2_item, count: parseInt(input2_count) })
            if (input3_count && input3_item) recipe.inputs.push({ name: input3_item, count: parseInt(input3_count) })
            // add gum output to recipe
            recipe.output = { name: output_item, count: parseInt(output_count) }
            dayOfCycle.recipes.push(recipe) // add recipe to cycle
            if (++recipeCount === 3) { // wrap up 'day of cycle' - 3 recipes per day
                cycles[numCycle].push(dayOfCycle) // add 'day of cycle' to cycle
                dayOfCycle = { dates: [], recipes: [] } // reset 'day of cycle'
                recipeCount = 0 // reset recipe count for next recipe
            }
        }
        updateProgress(++rowsDone, json.rows.length)
    }
    cycles.lastCycle = lastCycle // set 'last recipe cycle' for reference
    return cycles
}

// COOKBOOK CYCLES & RECIPES

// show the recipes of the given Moment()
function showRecipesOfMoment(cookbook_cycles, momentVal) {
    let days_of_cycles = getDaysOfCycles(cookbook_cycles)
    let day_in_cycle = days_of_cycles.find(({ dates }) => dates.some(
        date => moment(date, "MM-DD-YYYY").isSame(momentVal, "day")
    ))
    dateInputRecipe.value = momentVal.format("YYYY-MM-DD")
    if (day_in_cycle) {
        showRecipes(day_in_cycle.recipes, day_in_cycle.dates)
    } else {
        divCookbookRecipes.innerHTML = `<h3 class="text-align: center">Recipe Not Found...</h3>`
        console.log(`Recipes of ${momentVal.format("MMMM Do YYYY")} is not found...`)
    }
}

// make a 'date-recipes' key-value map
function makeRecipesByDates(days_in_recipes) {
    let recipes_by_dates = {}
    for (let day of days_in_recipes) {
        for (let date of day.dates) {
            recipes_by_dates[date] = day.recipes
        }
    }
    return recipes_by_dates
}

// flatten days of cycles into a list of days
function getDaysOfCycles(cookbook_cycles) {
    let days_of_cycles = []
    for (var prop in cookbook_cycles) {
        if (cookbook_cycles.hasOwnProperty(prop)) {
            days_of_cycles = days_of_cycles.concat(cookbook_cycles[prop])
        }
    }
    return days_of_cycles
}

// Get URL for gum image
function getGumImage(gum_name) {
    const gum = gobblegums_flat.find(gum => gum.name.toUpperCase() == gum_name.toUpperCase())
    if (gum !== undefined) {
        return gum.img
    } else {
        console.log(`[getGumImage] image for ${gum_name} not found...`)
    }
}

// Utilities

function get(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", url)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
    })
}