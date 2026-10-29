const cache = new Map<string, string>();

/** A seeded pseudo-random sequence, so the marble looks the same on every visit. */
const seeded = (seed: number) => {
    let state = seed % 2147483647 || 1;
    return () => (state = (state * 16807) % 2147483647) / 2147483647;
};

/**
 * Paints a disc of veined marble on a canvas and returns it as a JPEG data URL. Painted once per size and seed, then cached.
 * Returns an empty string where there is no canvas (tests), and the CSS fallback colour shows instead.
 */
export const marbleTexture = (size: number, seed: number): string => {
    const key = `${size}:${seed}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return "";

    const random = seeded(seed);
    canvas.width = canvas.height = size;

    const base = context.createRadialGradient(size * 0.36, size * 0.3, size * 0.05, size * 0.5, size * 0.5, size * 0.72);
    base.addColorStop(0, "#f3ede2");
    base.addColorStop(0.5, "#d3cabb");
    base.addColorStop(1, "#8b8170");
    context.fillStyle = base;
    context.fillRect(0, 0, size, size);

    for (let i = 0; i < size * 4; i++) {
        context.fillStyle = `rgba(${random() < 0.5 ? "80,70,58" : "255,252,245"},${random() * 0.08})`;
        context.fillRect(random() * size, random() * size, 1.5, 1.5);
    }

    context.shadowColor = "rgba(96,84,68,.4)";
    context.shadowBlur = 3;
    for (let vein = 0; vein < 18; vein++) {
        let x = random() * size;
        let y = random() * size;
        let angle = random() * Math.PI * 2;
        context.beginPath();
        context.moveTo(x, y);
        for (let step = 0; step < 40; step++) {
            angle += (random() - 0.5) * 0.7;
            x += (Math.cos(angle) * size) / 34;
            y += (Math.sin(angle) * size) / 34;
            context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(96,84,68,${0.08 + random() * 0.22})`;
        context.lineWidth = 0.4 + random() * 1.6;
        context.stroke();
    }

    const url = canvas.toDataURL("image/jpeg", 0.85);
    cache.set(key, url);
    return url;
};
