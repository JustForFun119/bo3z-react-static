import csv
import json
cycles = {}  # cookbook cycles
# Open cookbook CSV data file
with open('ref/ncc.csv') as ncc_file:
    reader = csv.reader(ncc_file)
    next(ncc_file)  # skip header line
    # Init 'day of cycle' dict
    day_of_cycle = {
        'dates': [],
        'recipes': []
    }
    recipe_count = 0  # track recipe count for rows
    for row in reader:  # loop rows in CSV file
        # deconstruct row to data
        (cycle_count, recipe_input, recipe_output, date1, date2,
         date3, date4) = row
        # take cycle count as int OR go to next line if not found
        if cycle_count:
            cycle_count = int(cycle_count)
            print('reading line... {}'.format(cycle_count))
        else:
            print('skipping line... {}'.format(cycle_count))
            continue
        # init the cycle dict array if it's not already
        try:
            # test cycle element is list?
            isinstance(cycles[cycle_count], list)
        except KeyError:  # catch KeyError if element is not found
            cycles[cycle_count] = []  # init element as list
        # add dates of the recipe to 'day of cycle'
        for date in [date1, date2, date3, date4]:
            date_added = date and day_of_cycle['dates'].append(date)
        # init recipe dict
        recipe = {
            'require': []
        }
        # Process and populate recipe I/O
        gum_inputs = recipe_input.split('+')  # split inputs by '+' symbol
        for gum_input in gum_inputs:  # split each input by '[count] [gum]'
            gum_input = gum_input.strip()  # trim spaces
            (gum_count, gum) = gum_input.split(' ', 1)
            # add gum input to recipe requirement
            recipe['require'].append({
                'name': gum,
                'count': int(gum_count)
            })
        # split output by '[count] [gum]'
        (gum_count, gum) = recipe_output.split(' ', 1)
        # add gum output to recipe
        recipe['product'] = {
            'name': gum,
            'count': int(gum_count)
        }
        day_of_cycle['recipes'].append(recipe)  # add recipe to 'day of cycle'
        recipe_count += 1  # recipe count++ to track day of cycle
        if recipe_count == 3:  # wrap up 'day of cycle' - 3 recipes per day
            # add 'day of cycle' to cycle
            cycles[cycle_count].append(day_of_cycle)
            # reset 'day of cycle'
            day_of_cycle = {
                'dates': [],
                'recipes': []
            }
            recipe_count = 0  # reset recipe count for next set of recipes
    print(json.dumps(cycles, indent=4))
with open('ref/ncc.json', 'w') as out_json:
    json.dump(cycles, out_json, indent=4)
print()
