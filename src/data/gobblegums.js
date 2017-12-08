// All Black Ops 3 Zombies GobbleGums
const all_gums = {
    classic: {
        normal: [
            {
                name: "Always Done Swiftly",
                type: "round",
                activation: "Activates Immediately (Lasts 3 full rounds)",
                effects: "Walk faster when aiming. Raise and lower your weapon to aim more quickly.",
                img: "img/gg/gg_always_done_swiftly.png"
            },
            {
                name: "Arms Grace",
                type: "immediate/condition",
                activation: "Activates Immediately (Lasts until next respawn)",
                effects: "Respawn with the guns you had when you bled out.",
                img: "img/gg/gg_arms_grace.png"
            },
            {
                name: "Coagulent",
                type: "time",
                activation: "Activates Immediately (Lasts 20 minutes)",
                effects: "Longer bleedout time.",
                img: "img/gg/gg_coagulent.png"
            },
            {
                name: "In Plain Sight",
                type: "activated",
                activation: "Activated (2x Activations, 10 seconds each)",
                effects: "You are ignored by zombies for 10 seconds.",
                img: "img/gg/gg_in_plain_sight.png"
            },
            {
                name: "Stock Option",
                type: "time",
                activation: "Activates Immediately (Last 3 minutes)",
                effects: "Ammo is taken from the your stockpile instead of your weapon's magazine.",
                img: "img/gg/gg_stock_option.png"
            },
            {
                name: "Impatient",
                type: "immediate/condition",
                activation: "Activates Immediately (Lasts until bleedout)",
                effects: "Respawn near the end of the current round instead of at the start of the next round.",
                img: "img/gg/gg_impatient.png"
            },
            {
                name: "Sword Flay",
                type: "time",
                activation: "Activates Immediately (Last 2.5 minutes)",
                effects: "Melee attacks deal zombies 5x as much damage.",
                img: "img/gg/gg_sword_flay.png"
            },
            {
                name: "Anywhere But Here!",
                type: "activated",
                activation: "Activated (2x Activations)",
                effects: "Instantly teleport to a random location. A concussive blast knocks away any nearby zombies, keeping you safe.",
                img: "img/gg/gg_anywhere_but_here.png"
            },
            {
                name: "Danger Closest",
                type: "round",
                activation: "Activates Immediately (Lasts 3 full rounds)",
                effects: "Zero explosive damage.",
                img: "img/gg/gg_danger_closest.png"
            },
            {
                name: "Armamental Accomplishment",
                type: "round",
                activation: "Activates Immediately (Lasts 3 full rounds)",
                effects: "Switch weapons and recover from performing melee attacks faster. Reload and use items more quickly.",
                img: "img/gg/gg_armamental_accomplishment.png"
            },
            {
                name: "Firing On All Cylinders",
                type: "round",
                activation: "Activates Immediately (Lasts 3 full rounds)",
                effects: "Can fire while sprinting.",
                img: "img/gg/gg_firing_on_all_cylinders.png"
            },
            {
                name: "Arsenal Accelerator",
                type: "time",
                activation: "Activates Immediately (Lasts 10 minutes)",
                effects: "Charge your special weapon faster.",
                img: "img/gg/gg_arsenal_accelerator.png"
            },
            {
                name: "Lucky Crit",
                type: "round",
                activation: "Activates Immediately (Lasts 1 full round)",
                effects: "Improves your chances of activating an Alternate Ammo Type.",
                img: "img/gg/gg_lucky_crit.png"
            },
            {
                name: "Now You See Me",
                type: "activated",
                activation: "Activated (2x Activations)",
                effects: "All zombies will chase you for 10 seconds.",
                img: "img/gg/gg_now_you_see_me.png"
            },
            {
                name: "Alchemical Antithesis",
                type: "activated",
                activation: "Activated (2x Activations, 60 seconds each)",
                effects: "Every 10 points earned is instead awarded 1 ammo in the stock of the current weapon.",
                img: "img/gg/gg_alchemical_antithesis.png"
            }
        ],
        whimsical: [
            {
                name: "Projectile Vomiting",
                rarity: "whimsical",
                type: "round",
                activation: "Activates Immediately (Lasts 5 full rounds)",
                effects: "Zombies you kill with grenades or other large projectiles vomit uncontrollably.",
                dlc: 3,
                img: "img/gg/gg_projectile_vomiting.png"
            },
            {
                name: "Newtonian Negation",
                rarity: "whimsical",
                type: "time",
                activation: "Activates Immediately (Lasts 25 minutes)",
                effects: "Zombies killed fall straight up.",
                dlc: 4,
                img: "img/gg/gg_newtonian_negation.png"
            }
        ]
    },
    mega: [
        {
            name: "Aftertaste",
            rarity: "mega",
            type: "round",
            activation: "Activates Immediately (Lasts 3 Rounds)",
            effects: "Keep all Perks after being revived.",
            img: "img/gg/gg_aftertaste.png"
        },
        {
            name: "Burned Out",
            rarity: "mega",
            type: "immediate/condition",
            activation: "Activates Immediately (Lasts 2 Hits)",
            effects: "The next time you take melee damage, nearby zombies burst into fire.",
            img: "img/gg/gg_burned_out.png"
        },
        {
            name: "Dead of Nuclear Winter",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations",
            effects: "Spawns a Nuke Power-Up.",
            img: "img/gg/gg_dead_of_nuclear_winter.png"
        },
        {
            name: "Ephemeral Enhancement",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations, 60 Seconds Each",
            effects: "Turns the weapon in the your hands into the Pack-A-Punched version.",
            img: "img/gg/gg_ephemeral_enhancement.png"
        },
        {
            name: "I'm Feeling Lucky",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations",
            effects: "Spawns a random Power-Up.",
            img: "img/gg/gg_im_feeling_lucky.png"
        },
        {
            name: "Immolation Liquidation",
            rarity: "mega",
            type: "activated",
            activation: "3x Activations",
            effects: "Spawns a Fire Sale Power-Up.",
            img: "img/gg/gg_immolation_liquidation.png"
        },
        {
            name: "Licensed Contractor",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations",
            effects: "Spawns a Carpenter Power-Up.",
            img: "img/gg/gg_licensed_contractor.png"
        },
        {
            name: "Phoenix Up",
            rarity: "mega",
            type: "activated",
            activation: "1x Activation",
            effects: "Revives all teammates. Teammates keep all of their Perks.",
            img: "img/gg/gg_phoenix_up.png"
        },
        {
            name: "Pop Shocks",
            rarity: "mega",
            type: "immediate/condition",
            activation: "Auto-Activates when attacking Zombies, 5x Activations",
            effects: "Melee attacks trigger an electrostatic discharge, electrocuting nearby Zombies.",
            img: "img/gg/gg_pop_shocks.png"
        },
        {
            name: "Respin Cycle",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations",
            effects: "Re-spins the weapons in the Mystery Box after it has been activated.",
            img: "img/gg/gg_respin_cycle.png"
        },
        {
            name: "Unquenchable",
            rarity: "mega",
            type: "immediate/condition",
            activation: "Auto-Activates when the player has 4 Maximum Perks",
            effects: "Can buy an extra perk.",
            img: "img/gg/gg_unquenchable.png"
        },
        {
            name: "Who's Keeping Score?",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations",
            effects: "Spawns a Double Points Power-Up.",
            img: "img/gg/gg_whos_keeping_score.png"
        },
        {
            name: "Fatal Contraption",
            rarity: "mega",
            type: "activated",
            activation: "2x Activations",
            effects: "Spawns a Death Machine Power-Up.",
            dlc: 1,
            img: "img/gg/gg_fatal_contraption.png"
        },
        {
            name: "Crawl Space",
            rarity: "mega",
            type: "activated",
            activation: "5x Activations",
            effects: "All nearby zombies become crawlers.",
            dlc: 1,
            img: "img/gg/gg_crawl_space.png"
        },
        {
            name: "Unbearable",
            rarity: "mega",
            type: "immediate/condition",
            activation: "Auto-activates when a teddy bear appears in the Mystery box",
            effects: "The Mystery box re-spins automatically. The Mystery box will not move for several uses.",
            dlc: 2,
            img: "img/gg/gg_unbearable.png"
        },
        {
            name: "Disorderly Combat",
            rarity: "mega",
            type: "time",
            activation: "Activates Immediately, Last for 5 minutes",
            effects: "Gives a random gun every 10 seconds.",
            dlc: 3,
            img: "img/gg/gg_disorderly_combat.png"
        },
        {
            name: "Slaughter Slide",
            rarity: "mega",
            type: "immediate/condition",
            activation: "Auto-activates when sliding, 6x Activations",
            effects: "Create 2 lethal explosions by sliding.",
            dlc: 3,
            img: "img/gg/gg_slaughter_slide.png"
        },
        {
            name: "Mind Blown",
            rarity: "mega",
            type: "activated",
            activation: "3x Activations",
            effects: "Gib the heads of all the zombies you can see, killing them.",
            dlc: 4,
            img: "img/gg/gg_mind_blown.png"
        },
        {
            name: "Board Games",
            rarity: "mega",
            type: "round",
            activation: "Activates Immediately (Lasts 5 Rounds)",
            effects: "Fixing one board at a barrier fixes all the boards at that barrier.",
            dlc: 5,
            img: "img/gg/gg_board_games.png"
        },
        {
            name: "Flavor Hexed",
            rarity: "mega",
            type: "immediate/condition",
            activation: "Activates Immediately",
            effects: "Selects a random Mega Gobblegum of any rarity that is not in the player's loadout and awards it to the player. If the player doesn't bleed out or purchase another GobbleGum, then this will repeat a second time once the first gum has been used.",
            dlc: 5,
            img: "img/gg/gg_flavor_hexed.png"
        },
        {
            name: "Idle Eyes",
            rarity: "mega",
            type: "activated",
            activation: "3 activations, 30 seconds each",
            effects: "All zombies ignore all players and stand idle.",
            dlc: 5,
            img: "img/gg/gg_idle_eyes.png"
        },
        {
            name: "Board To Death",
            rarity: "mega",
            type: "time",
            activation: "Activates Immediately, Last for 5 minutes",
            effects: "Zombies within 15 feet of a repaired board are killed.",
            dlc: 5,
            img: "img/gg/gg_board_to_death.png"
        }
    ],
    rare: [
        {
            name: "Cache Back",
            rarity: "rare",
            type: "activated",
            activation: "1x Activation",
            effects: "Spawns a Max Ammo Power-Up.",
            img: "img/gg/gg_cache_back.png"
        },
        {
            name: "Kill Joy",
            rarity: "rare",
            type: "activated",
            activation: "2x Activation",
            effects: "Spawns an Insta-Kill Power-Up.",
            img: "img/gg/gg_kill_joy.png"
        },
        {
            name: "On The House",
            rarity: "rare",
            type: "activated",
            activation: "1x Activation",
            effects: "Spawns a Random Perk Bottle Power Up.",
            img: "img/gg/gg_on_the_house.png"
        },
        {
            name: "Wall Power",
            rarity: "rare",
            type: "immediate/condition",
            activation: "Auto-activates on your next wall-buy gun purchase",
            effects: "The next wall weapon purchased becomes Pack-a-Punched.",
            img: "img/gg/gg_wall_power.png"
        },
        {
            name: "Undead Man Walking",
            rarity: "rare",
            type: "time",
            activation: "Activates Immediately, Last 4 minutes",
            effects: "Slow down all zombies to shambling speed.",
            dlc: 1,
            img: "img/gg/gg_undead_man_walking.png"
        },
        {
            name: "Fear in Headlights",
            rarity: "rare",
            type: "activated",
            activation: "1x Activation, 2 minutes",
            effects: "Zombies seen by players will not move.",
            dlc: 2,
            img: "img/gg/gg_fear_in_headlights.png"
        },
        {
            name: "Temporal Gift",
            rarity: "rare",
            type: "round",
            activation: "Activates Immediately, Last 1 round",
            effects: "Power ups last longer.",
            dlc: 2,
            img: "img/gg/gg_temporal_gift.png"
        },
        {
            name: "Crate Power",
            rarity: "rare",
            type: "immediate/condition",
            activation: "Auto-activates next time you take a gun from the magic box",
            effects: "The next gun taken from the magic box comes Pack-a-Punched.",
            dlc: 3,
            img: "img/gg/gg_crate_power.png"
        },
        {
            name: "Bullet Boost",
            rarity: "rare",
            type: "activated",
            activation: "2x Activations",
            effects: "Re-Pack your current Pack-a-Punched gun (if supported).",
            dlc: 4,
            img: "img/gg/gg_bullet_boost.png"
        },
        {
            name: "Extra Credit",
            rarity: "rare",
            type: "activated",
            activation: "4x Activations",
            effects: "Spawns a Blood Money Power-Up worth 1,250 points.",
            dlc: 5,
            img: "img/gg/gg_extra_credit.png"
        },
        {
            name: "Soda Fountain",
            rarity: "rare",
            type: "immediate/condition",
            activation: "Auto-activates when buying a perk, 5 Activations",
            effects: "Perk purchase limit is ignored. Every perk you buy, a random perk is awarded along with the perk you bought.",
            dlc: 5,
            img: "img/gg/gg_soda_fountain.png"
        }
    ],
    ultra_rare: [
        {
            name: "Killing Time",
            rarity: "ultra_rare",
            type: "activated",
            activation: "1x Activation",
            effects: "All zombies freeze in place for 20 seconds. If they are shot they will be annihilated when the time is up.",
            img: "img/gg/gg_killing_time.png"
        },
        {
            name: "Perkaholic",
            rarity: "ultra_rare",
            type: "immediate/condition",
            activation: "Activates Immediately",
            effects: "Gives the player all Perk-a-Colas in the map.",
            img: "img/gg/gg_perkaholic.png"
        },
        {
            name: "Head Drama",
            rarity: "ultra_rare",
            type: "round",
            activation: "Activates Immediately, Lasts for the Remainder of the Round",
            effects: "Any bullet which hits a zombie will damage its head.",
            dlc: 1,
            img: "img/gg/gg_head_drama.png"
        },
        {
            name: "Secret Shopper",
            rarity: "ultra_rare",
            type: "time",
            activation: "Activated Immediately, Lasts 10 minutes",
            effects: "Any gun wall-buy can be used to buy ammo for any gun.",
            dlc: 2,
            img: "img/gg/gg_secret_shopper.png"
        },
        {
            name: "Shopping Free",
            rarity: "ultra_rare",
            type: "time",
            activation: "Activated Immediately, Lasts 1 minute",
            effects: "All purchases are free.",
            dlc: 3,
            img: "img/gg/gg_shopping_free.png"
        },
        {
            name: "Near Death Experience",
            rarity: "ultra_rare",
            type: "round",
            activation: "Activates Immediately, Lasts 3 full rounds",
            effects: "Revive, or be revived simply by being near other players. Revived players keep all their perks.",
            dlc: 4,
            img: "img/gg/gg_near_death_experience.png"
        },
        {
            name: "Profit Sharing",
            rarity: "ultra_rare",
            type: "time",
            activation: "Activates Immediately, Lasts 10 minutes",
            effects: "Points you earn are also recieved by nearby players and vice versa.",
            dlc: 4,
            img: "img/gg/gg_profit_sharing.png"
        },
        {
            name: "Round Robbin'",
            rarity: "ultra_rare",
            type: "activated",
            activation: "1x Activation",
            effects: "Ends the current round. All players gain 1600 points.",
            dlc: 4,
            img: "img/gg/gg_round_robbin.png"
        },
        {
            name: "Self Medication",
            rarity: "ultra_rare",
            type: "immediate/condition",
            activation: "Auto-activates by getting a kill in last stand, 3x Activations",
            effects: "Auto revive yourself. Keep all your perks.",
            dlc: 4,
            img: "img/gg/gg_self_medication.png"
        },
        {
            name: "Power Vacuum",
            rarity: "ultra_rare",
            type: "round",
            activation: "Activates Immediately, Lasts 4 rounds",
            effects: "Power-Ups spawn more often.",
            dlc: 5,
            img: "img/gg/gg_power_vacuum.png"
        },
        {
            name: "Reign Drops",
            rarity: "ultra_rare",
            type: "activated",
            activation: "2x Activations",
            effects: "Spawns all the core power-ups at once (Nuke, Double Points, Fire Sale, Insta-Kill, Random Perk Bottle, Max Ammo, Death Machine, Carpenter, Blood Money).",
            dlc: 5,
            img: "img/gg/gg_reign_drops.png"
        }
    ]
}

const flattened_gums = [...all_gums.classic.normal, ...all_gums.classic.whimsical,
...all_gums.mega, ...all_gums.rare, ...all_gums.ultra_rare]

const gums_rarity = {
    'whimsical': {
        style: 'gum-rarity-whimsical',
        text: 'WHIMSICAL'
    },
    'mega': {
        style: 'gum-rarity-mega',
        text: 'MEGA'
    },
    'rare': {
        style: 'gum-rarity-rare',
        text: 'RARE'
    },
    'ultra_rare': {
        style: 'gum-rarity-ultra-rare',
        text: 'ULTRA RARE'
    }
}

// configure images path basename
const basename = '/'
flattened_gums.forEach(gum => gum.img = basename + gum.img)

// Flatten 'gobblegums' array for easier linear search
export default {
    map: all_gums,
    flattened: flattened_gums,
    rarity: gums_rarity,
    getGumByName: gumName => flattened_gums.find(gum => gum.name === gumName),
    getGumCategory: targetGum => {
        const finder = gum => gum.name === targetGum.name
        const classic_gums = [...all_gums.classic.normal, ...all_gums.classic.whimsical]
        if (classic_gums.find(finder)) return 'Classic'
        const mega_gums = [...all_gums.mega, ...all_gums.rare, ...all_gums.ultra_rare]
        if (mega_gums.find(finder)) return 'Mega'
        return 'Unknown'
    }
}