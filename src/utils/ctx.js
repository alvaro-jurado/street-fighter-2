// Esta función obtiene el contexto 2D del elemento canvas y realiza algunas configuraciones iniciales.
export function getContext() {
    // Selecciona el elemento canvas del documento.
    const canvas = document.querySelector('canvas');
    // Obtiene el contexto 2D del canvas.
    const ctx = canvas.getContext('2d');
    // Desactiva el suavizado de imágenes en el contexto.
    ctx.imageSmoothingEnabled = false;
    // Devuelve el contexto 2D configurado.
    return ctx;
}

// Esta función dibuja un "frame" en el contexto proporcionado, utilizando una imagen y dimensiones específicas.
export function drawFrame(ctx, image, dimensions, x, y, direction = 1) {
    // Desglosa las dimensiones de la fuente de la imagen [sourceX, sourceY, sourceWidth, sourceHeight].
    const [sourceX, sourceY, sourceWidth, sourceHeight] = dimensions;

    // Escala el contexto en la dirección especificada (1 o -1 para girar horizontalmente).
    ctx.scale(direction, 1);

    // Dibuja la imagen en el contexto, utilizando las dimensiones y la posición especificadas.
    ctx.drawImage(
        image,
        sourceX, sourceY, sourceWidth, sourceHeight,
        x * direction, y, sourceWidth, sourceHeight,
    );

    // Restablece la transformación del contexto a la identidad para evitar efectos no deseados en otros dibujos.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
