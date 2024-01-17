export class EntityList {

    // Propiedad que almacena la lista de entidades
    entities = [];

    // Método para agregar una entidad a la lista
    add(EntityClass, time, ...args) {
        // Se crea una nueva instancia de la clase de entidad proporcionada
        // y se agrega a la lista de entidades con los argumentos dados
        this.entities.push(new EntityClass(args, time, this))
    }

    // Método para eliminar una entidad de la lista
    remove(entity) {
        // Se busca el índice de la entidad en la lista
        const index = this.entities.indexOf(entity);

        // Si la entidad no se encuentra en la lista, se sale del método
        if (index < 0) {
            return;
        }

        // Se elimina la entidad de la lista
        this.entities.splice(index, 1);
    }

    // Método para actualizar todas las entidades en la lista
    update(time, ctx, camera) {
        // Se itera a través de todas las entidades y se llama al método update de cada una
        for (const entity of this.entities) {
            entity.update(time, ctx, camera);
        }
    }

    // Método para dibujar todas las entidades en la lista
    draw(ctx, camera) {
        // Se itera a través de todas las entidades y se llama al método draw de cada una
        for (const entity of this.entities) {
            entity.draw(ctx, camera);
        }
    }
}
