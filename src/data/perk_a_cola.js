const perk_jingles_path = 'audio/perk_jingles/';

let Perks = {
    // World at War: Original 4
    juggernog: {
        name: 'Juggernog',
        jingleAudioFile: 'juggernog.ogx'
    },
    double_tap: {
        name: 'Double Tap',
        jingleAudioFile: 'double_tap.ogx'
    },
    speed_cola: {
        name: 'Speed Cola',
        jingleAudioFile: 'speed_cola.ogx'
    },
    quick_revive: {
        name: 'Quick Revive',
        jingleAudioFile: 'quick_revive.ogx'
    },
    // Black Ops
    phd_flopper: {
        name: 'PHD Flopper',
        jingleAudioFile: 'phd_flopper.ogx'
    },
    stamin_up: {
        name: 'Stamin-up',
        jingleAudioFile: 'stamin_up.ogx'
    },
    deadshot: {
        name: 'Deadshot Daiquiri',
        jingleAudioFile: 'deadshot_daiquiri.ogx'
    },
    mule_kick: {
        name: 'Mule Kick',
        jingleAudioFile: 'mule_kick.oga'
    },
    // Black Ops 2
    tombstone: {
        name: 'Tombstone Soda',
        jingleAudioFile: 'tombstone_soda.ogx'
    },
    whos_who: {
        name: 'Who\'s Who',
        jingleAudioFile: 'whos_who.ogx'
    },
    vulture_aid: {
        name: 'Vulture Aid',
        jingleAudioFile: 'vulture_aid.ogx'
    },
    // Black Ops 3
    widows_wine: {
        name: 'Widow\'s Wine',
        jingleAudioFile: 'widows_wine.ogx'
    },
    // Shadows of Evil versions of original 4 perks + Mule Kick
    juggernog_soe: {
        name: 'Juggernog (SoE)',
        jingleAudioFile: 'juggernog_soe.ogx'
    },
    double_tap_soe: {
        name: 'Double Tap (SoE)',
        jingleAudioFile: 'double_tap_soe.ogx'
    },
    speed_cola_soe: {
        name: 'Speed Cola (SoE)',
        jingleAudioFile: 'speed_cola_soe.ogx'
    },
    quick_revive_soe: {
        name: 'Quick Revive (SoE)',
        jingleAudioFile: 'quick_revive_soe.ogx'
    },
    mule_kick_soe: {
        name: 'Mule Kick (SoE)',
        jingleAudioFile: 'mule_kick_soe.ogx'
    }
};
// construct full path for audio files
Object.values(Perks).forEach(perk => perk.jingleAudioFile = perk_jingles_path + perk.jingleAudioFile)

export default Perks;