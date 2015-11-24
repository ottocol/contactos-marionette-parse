

Backbone.Marionette.Renderer.render = function(template, data) {
    return Mustache.render($(template).html(), data);
}

//Vista de Backbone que representa un único contacto
var VistaContacto = Backbone.Marionette.ItemView.extend({
    //queremos que la vista "cuelgue" de un div
    //Esto es solo para ilustrar, ya que <div> es lo que se usa por defecto
    tagName: 'div',

    //queremos que la etiqueta de la que "cuelga" la vista tenga la class="contacto"
    //Así podremos darle un estilo apropiado con CSS
    className: 'contacto',

    //plantilla Mustache para modo edición
    templateEdit: "#contacto_edit_tmpl",
    //plantilla Mustache para modo edición
    templateView: "#contacto_tmpl",

    //plantilla Mustache por defecto
    template: "#contacto_tmpl",

    //por defecto no estamos editando ningún contacto
    editando: false,



    //Se dispara al pulsar sobre el botón "editar" del contacto en modo visualización
    editar: function() {
        //Si ya estamos editando, no permitirlo
        if (this.editando)
            return
        this.editando = true
        //pasamos a modo edición
        this.template = this.templateEdit
        this.render();
     },

    //Se dispara al pulsar sobre el botón "guardar"
    guardar: function() {
        //tomamos los nuevos valores
        this.model.set("nombre", this.el.querySelector("#nombre_edit").value)
        this.model.set("apellidos", this.el.querySelector("#apellidos_edit").value)
        this.model.set("email", this.el.querySelector("#email_edit").value)
        //Cuando el modelo se sincronice con el servidor, disparamos "visualizar"
        this.listenToOnce(this.model,'sync',this.visualizar);
        //guardamos en el servidor
        this.model.save().done(function(){
            alert("Contacto guardado correctamente")
        }).fail(function(){
            alert("Error al guardar contacto en el servidor")
        });
        
    },

    visualizar: function() {
        this.editando = false
        //Pasamos a modo visualización
        this.template = this.templateView;
        this.render()
    },

    borrar: function() {
      //borramos el modelo del servidor  
      this.model.destroy().done(function(){
        alert("Contacto eliminado");
      })
    },

    //Cada contacto tiene su propio botón de editar y borrar
    //(guardar si está en modo edición)
    events: {
        'click .boton_editar' : 'editar',
        'click .boton_guardar' : 'guardar',
        'click .boton_borrar' : 'borrar'
    }

})




//Vista de Marionette que representa a la lista entera de contactos
//Tiene una subvista por cada contacto
var VistaAgenda = Backbone.Marionette.CollectionView.extend({
    //La vista "cuelga" de la etiqueta cuyo id="agenda"
    el: '#agenda',

    childView: VistaContacto,

    initialize: function() {
        //Le pedimos la agenda de contactos al servidor. Asíncrono!!
        this.collection.fetch({reset:true})
        //Cuando se produzca el "reset", dibujamos la vista.
        //Antes la colección todavía no habrá llegado del servidor
        this.listenTo(this.collection, "reset", this.render);
     }
});

var VistaNuevoContacto = Backbone.Marionette.ItemView.extend({
    el: '#nuevo_contacto',
    template: '#nuevo_contacto_tmpl',
    nuevo: function() {
        var nuevo_contacto = new Contacto()
        nuevo_contacto.set("nombre", this.el.querySelector('#nombre').value);
        nuevo_contacto.set("apellidos", this.el.querySelector('#apellidos').value);
        nuevo_contacto.set("email", this.el.querySelector('#email').value);
        nuevo_contacto.save().done(function(){
            this.collection.add(nuevo_contacto);
            alert("Contacto guardado");
        }.bind(this)).fail(function(){
            alert("Error al guardar contacto");
        })
    },
    
    events: {
        'click #boton_nuevo': 'nuevo',
        'click #boton_filtrar' : 'filtrar'
    }
});

