const ImagePath = {
    enemies: 'img/enemies/',
    maps: 'img/maps/',
    wonder_weapons: 'img/wonder_weapons/',
};

const enemies = {
    margwa: {
        name: 'Margwa',
        img: 'margwa.png',
    },
    parasite: {
        name: 'Parasite',
        img: 'parasite.png',
    },
    keeper: {
        name: 'Keeper',
        img: 'keeper.png',
    },
    insanity_elemental: {
        name: 'Insanity Elemental',
        img: 'insanity_elemental.png',
    },
    shadowman: {
        name: 'Shadowman',
    },
    panzer_soldat: {
        name: 'Panzer Soldat',
        img: 'panzer_soldat.png',
    },
    thrasher: {
        name: 'Thrasher',
        img: 'thrasher.png',
    },
    spider: {
        name: 'Spider',
        img: 'spider.png',
    },
    giant_spider: {
        name: 'Giant Spider',
        img: 'giant_spider.png',
    },
    valkyrie_drone: {
        name: 'Valkyrie Drone',
        img: 'valkyrie_drone.png',
    },
    mangler_soldier: {
        name: 'Mangler Soldier',
        img: 'mangler_soldier.png',
    },
    dragon: {
        name: 'Dragon',
    },
    raps: {
        name: 'R.A.P.S.',
    },
    apothicons: {
        name: 'Apothicons',
    },
    fury: {
        name: 'Fury',
        img: 'fury.png',
    },
};
// add full image file paths to 'img' value
Object.values(enemies).forEach(enemy => { if (enemy.img) enemy.img = ImagePath.enemies + enemy.img; });

const wonder_weapons = {
    ray_gun: {
        name: 'Ray Gun',
        img: 'ray_gun.png'
    },
    wunderwaffe_dg2: {
        name: 'Wunderwaffe DG-2',
        img: 'wunderwaffe_dg2.png'
    },
    monkey_bomb: {
        name: 'Monkey Bomb',
        img: 'monkey_bomb.png'
    },
    // Kino der Toten
    thundergun: {
        name: 'Thundergun',
        img: 'thundergun.png'
    },
    // Ascension
    gersch_device: {
        name: 'Gersch Device',
        img: 'gersch_device.png'
    },
    // Shangri La
    baby_gun: {
        name: '31-79_jGb215',
        img: '31-79_jGb215.png'
    },
    // Moon
    wave_gun: {
        name: 'Wave Gun',
        img: 'wave_gun.png'
    },
    zap_gun: {
        name: 'Zap Gun',
        img: 'zap_gun.png'
    },
    qed: {
        name: 'QED',
        img: 'qed.png'
    },
    // Origins
    staff_of_fire: {
        name: 'Staff of Fire',
        img: 'staff_of_fire.png'
    },
    staff_of_ice: {
        name: 'Staff of Ice',
        img: 'staff_of_ice.png'
    },
    staff_of_lightning: {
        name: 'Staff of Lightning',
        img: 'staff_of_lightning.png'
    },
    staff_of_wind: {
        name: 'Staff of Wind',
        img: 'staff_of_wind.png'
    },
    // TODO: image for 'G-strike' is too tall for mobile view, idea to solve?
    // g_strike: {
    //     name: 'G Strike',
    //     img: 'g_strike.png'
    // },
    // Shadows of Evil
    apothicon_servant: {
        name: 'Apothicon Servant',
        img: 'apothicon_servant.png'
    },
    lil_arnie: {
        name: 'Li\'l Arnie',
        img: 'lil_arnie.png'
    },
    apothicon_sword: {
        name: 'Apothicon Sword'
    },
    // Der Eisendrache
    wrath_of_the_ancients: {
        name: 'Wrath of the Ancients',
        img: 'wrath_of_the_ancients.png'
    },
    ragnarok_dg4: {
        name: 'Ragnarok DG-4',
        img: 'ragnarok_dg4.png'
    },
    // Zetsubou No Shima
    kt4: {
        name: 'KT-4',
        img: 'kt4.png'
    },
    skull_of_nan_sapwe: {
        name: 'Skull of Nan Sapwe',
        img: 'skull_of_nan_sapwe.png'
    },
    spider_bait: {
        name: 'Spider Bait'
    },
    // Gorod Krovi
    gauntlet_of_siegfried: {
        name: 'Guantlet of Siegfried',
        img: 'gauntlet_of_siegfried.png'
    },
    gkz45_mk3: {
        name: 'GKZ-45 MK3',
        img: 'gkz45_mk3.png'
    },
    dragon_strike: {
        name: 'Dragon Strike'
    }
};
// add full image file paths to 'img' value
Object.values(wonder_weapons).forEach(weapon => { if (weapon.img) weapon.img = ImagePath.wonder_weapons + weapon.img; });

const maps = {
    soe: {
        name: 'Shadows of Evil',
        starting_pistol: 'Bloodhound',
        special_enemies: [enemies.margwa, enemies.parasite, enemies.keeper, enemies.insanity_elemental, enemies.shadowman],
        wonder_weapons: [wonder_weapons.ray_gun, wonder_weapons.apothicon_servant, wonder_weapons.lil_arnie, wonder_weapons.apothicon_sword],
        images: ['soe_splash.png', 'soe_nero.png', 'soe_plaza.png', 'soe_canal.png', 'soe_canal2.png']
    },
    de: {
        name: 'Der Eisendrache',
        starting_pistol: 'MR6',
        special_enemies: [enemies.panzer_soldat],
        wonder_weapons: [wonder_weapons.ray_gun, wonder_weapons.wrath_of_the_ancients, wonder_weapons.ragnarok_dg4],
        images: ['de_splash.png', 'de_cable_cars.png', 'de_courtyard.png', 'de_courtyard_high.png', 'de_control_room.png', 'de_bow_pedestal.jpg', 'de_death_ray.png', 'de_pyramid_room.jpg', 'de_rocket.png']
    },
    zns: {
        name: 'Zetsubou No Shima',
        starting_pistol: 'MR6',
        special_enemies: [enemies.thrasher, enemies.spider, enemies.giant_spider],
        wonder_weapons: [wonder_weapons.ray_gun, wonder_weapons.skull_of_nan_sapwe, wonder_weapons.kt4, wonder_weapons.spider_bait],
        images: ['zns_splash.png', 'zns_lab.png', 'zns_lab2.png', 'zns_lab_underground.png', 'zns_plane.png', 'zns_skull_challenge_pedestal.png', 'zns_skull_of_nan_sapwe.jpg', 'zns_spider_pond.png']
    },
    gk: {
        name: 'Gorod Krovi',
        starting_pistol: 'MR6',
        special_enemies: [enemies.valkyrie_drone, enemies.mangler_soldier, enemies.dragon, enemies.raps],
        wonder_weapons: [wonder_weapons.ray_gun, wonder_weapons.gkz45_mk3, wonder_weapons.gauntlet_of_siegfried, wonder_weapons.dragon_strike],
        images: ['gk_splash.png', 'gk_spawn.png', 'gk_spawn2.png', 'gk_command.png']
    },
    rev: {
        name: 'Revelations',
        starting_pistol: 'MR6',
        special_enemies: [enemies.margwa, enemies.parasite, enemies.panzer_soldat, enemies.spider, enemies.apothicons, enemies.fury],
        wonder_weapons: [wonder_weapons.ray_gun, wonder_weapons.thundergun, wonder_weapons.apothicon_servant, wonder_weapons.lil_arnie, wonder_weapons.ragnarok_dg4],
        images: ['rev_splash.png', 'rev_spawn.jpg', 'rev_inside_apothicon.jpg']
    }
    // TODO: add Chronicles maps
};
// add full image file paths to 'img' value
Object.values(maps).forEach(map => {
    if (map.images) map.images = map.images.map(imageName => ImagePath.maps + imageName);
});

export {
    maps as Maps,
    enemies as Enemies,
    wonder_weapons as WonderWeapons,
};