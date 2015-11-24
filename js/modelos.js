var Contacto = Backbone.Model.extend({
    urlRoot: 'https://api.parse.com/1/classes/Contacto',
    idAttribute: 'objectId',
    defaults: {
      "nombre": "",
      "apellidos": "",
      "email" : ""
    },
    //Se llama automáticamente al hacer save()
    //Si no hay errores de validación no debe devolver nada
    //Qué devolver exactamente si hay errores corre de cuenta de la aplicación
    validate: function(atributos, opciones) {
        //En nuestro ejemplo devolvemos un array de mensajes de error
        var errores = [];
        if(!atributos.nombre)
            errores.push("Falta nombre")
        if (!atributos.apellidos)
            errores.push("Faltan apellidos")
        if (errores.length>0)
            return errores;
    },
    guardar: function() {
      if (this.isValid()) {
        //Ejemplo de uso de save con promesas
        this.save().done(function() {
            console.log("Contacto guardado correctamente")  
        }).fail(function() {
            console.log("Contacto NO guardado")                
        });
      }
    }
})






var Agenda = Backbone.Collection.extend({
    url: 'https://api.parse.com/1/classes/Contacto',
    model: Contacto,
    //Ejemplo de uso de la función "filter"
    //por ejemplo filtrar_por_nombre("Pep") nos devolvería
    //todos los contactos cuyo nombre contuviera esa cadena
    filtrar_por_nombre: function(cadena) {
        return this.filter(function(modelo) {
            var nombreCompleto = modelo.get('nombre') + ' ' + modelo.get("apellidos");
            return (nombreCompleto.indexOf(cadena)>=0)
        })
    },
    parse: function(response) {
      return response.results;
    }
})


