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

export const SPEED_COEFFICIENT = 1; // 1 means 1 second in real time is 1 day in simulation

//filtering out solar system bodies by their parameters:
export const DATA_FILTERS = {
    minRadius: 1 // 6.2 = deimos
}

export const CAMERA_SETTINGS = {
    default: {
        position: { x: 0, y: 20, z: 80 },
        fov: 80,
        near: 0.1,
        far: 1000
    }
};

export const LIGHT_SETTINGS = {
    ambientDefault: {
        color: 0xffffff,
        intensity: 0.8
    },
    sunlightDefault: {
        color: 0xffffff,
        intensity: 10000,
        distance: 250000,
        decay: 2 // no effect
    },
};

export const BACKGROUND_OPACITY = 0.2;
