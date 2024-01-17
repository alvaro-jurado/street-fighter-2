// Función que verifica si dos rectángulos se superponen en el plano.
export function rectsOverlap(x1, y1, width1, height1, x2, y2, width2, height2) {
    return x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2;
}

// Función que verifica si dos cajas se superponen.
export function boxOverlap(box1, box2) {
    return rectsOverlap(box1.x, box1.y, box1.width, box1.height, box2.x, box2.y, box2.width, box2.height);
}

// Función que calcula las dimensiones de una caja en función de una posición, dirección y otra caja de referencia.
export function getBoxDimensions(position, direction, box) {
    // Calcula las coordenadas x1 y x2 de la caja en función de la posición y dirección proporcionadas.
    const x1 = position.x + (box.x * direction);
    const x2 = x1 + (box.width * direction);

    // Devuelve un objeto con las dimensiones de la caja resultante.
    return {
        x: Math.min(x1, x2),
        y: position.y + box.y,
        width: box.width,
        height: box.height,
    };
}
