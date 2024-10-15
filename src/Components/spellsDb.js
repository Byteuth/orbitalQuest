export function getSpellDamage(spellId) {
    const damageValue = {
        1: 10,
        2: 20,
        3: 30,
        4: 40,
    };

    return damageValue[spellId] || 0
}   


