export const SCALING_FACTORS = {
    // if any value is null, the default value will be used

    default: 10000,
    planets: null,
    moons: null,

    // Faktor für den Abstand der Planeten
    orbits: 400000,
    moonOrbits: 50000,

    // Faktor für die Sonnen-Geometrie
    sun: 20000,
    sunGlow: 1.35 // relative to its bodySize
};

//1 means 1 second in real time is 1 day in simulation
export const SPEED_COEFFICIENT = 1;

export const DATA_FILTERS = {
    minRadius: 6.2 // deimos
}

// Weitere globale Konstanten können hier hinzugefügt werden
