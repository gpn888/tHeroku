var config = {
    apiKey: "AIzaSyAsImHMg-2VcZ9XnQcv7qizT_JwZLj6M14",
    authDomain: "admintorioux.firebaseapp.com",
    databaseURL: "https://admintorioux.firebaseio.com",
    projectId: "admintorioux",
    storageBucket: "admintorioux.appspot.com",
    messagingSenderId: "725463825217"
  };
firebase.initializeApp(config);

//0. Autenticar
//viene de https://firebase.google.com/docs/auth/web/start?authuser=0

var ingresar = function(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log('Bienvenido');
        window.location = "agregarBebida.html";
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error de ingreso | ' + error.code + ' | ' + error.message)
    });
}

//0.1 Autenticacion
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('autorizado');
        //0.2 cerrar sesion
    } else {
        console.log('no autorizado');
        if(window.location.pathname !== "/index.html"){
    	    window.location = "index.html";
        }
    }
});

var salir = function () {
    firebase.auth().signOut()
    .then(function() {
        console.log('terminado')
    }).catch(function(error) {
        console.log('Error al terminar sesion ' + error)
    });
}


// Crear Platillos

var database = firebase.database();

var escribirPlatillo = function(pNombre, pDescripcion, pPrecio, pDireccion, pTexto){
    database.ref('alimentos/').push({
        nombre: pNombre,
        descripcion: pDescripcion,
        precio: pPrecio,
        cantidad: 0,
        //4.2)2-que suba al database
        direccion: pDireccion,
        texto: pTexto
    }).then(function() {
        alert('Se agrego platillo');
        window.location = "agregarPlatillo.html";
    }).catch(function(error) {
        alert('No se agrego platillo' + error);
    })
}

var escribirBebidas = function(pNombre, pDescripcion, pPrecio, pDireccion, pTexto){
    database.ref('bebidas/').push({
        nombre: pNombre,
        descripcion: pDescripcion,
        precio: pPrecio,
        cantidad: 0, 
        direccion: pDireccion,
        texto: pTexto
    }).then(function() {
        alert('Se agrego bebida');
        window.location = "agregarBebida.html";
    }).catch(function(error) {
        alert('No se agrego bebida' + error);
    })
}

// 2) Leer platillos
var imprimirPlatillos = function(){
    //referencia al database
    var query = database.ref('alimentos/');
    //segun la API de firebase "value" da el valor - childSnapshot(a cada elemento)
    query.on('value', function(snapshot){
        var ul = document.getElementById("lista");
        while(ul.firstChild) ul.removeChild(ul.firstChild);

        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.key);
            console.log(childSnapshot.val());

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            ul.insertAdjacentHTML(
                'beforeend', 
                    '<li class="list-group-item col-xs-12 col-sm-6">' +
                        '<div class="media-left">' +
                            '<img height="60" src="' + (childData.direccion) + '" alt="' + (childData.texto) + '" title="' + (childData.texto) + '" />' +
                        '</div>' +
                        '<div class="media-body text-right">' +
                            '<h4 class="media-heading">' + (childData.nombre) + '</h4>' +
                            '<p>' + (childData.descripcion) + '</p>' +
                            '<h5><span class="badge">S/.' + (childData.precio) + '</span></h5>' +
                        '</div>' +
                        '<button class="btn btn-danger" id="' + (childKey) + '" onclick="eliminarPlatillos(this.id)">Eliminar Platillo</button>' +
                    '</li>'
            );
            
        });
        //console.log(snapshot.val());
    })
}

var imprimirBebidas = function(){ 
    var query = database.ref('bebidas/'); 
    query.on('value', function(snapshot){
        var ul = document.getElementById("lista");
        while(ul.firstChild) ul.removeChild(ul.firstChild);

        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.key);
            console.log(childSnapshot.val());

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            ul.insertAdjacentHTML(
                'beforeend', 
                    '<li class="list-group-item col-xs-12 col-sm-6">' +
                        '<div class="media-left">' +
                            '<img height="60" src="' + (childData.direccion) + '" alt="' + (childData.texto) + '" title="' + (childData.texto) + '" />' +
                        '</div>' +
                        '<div class="media-body text-right">' +
                            '<h4 class="media-heading">' + (childData.nombre) + '</h4>' +
                            '<p>' + (childData.descripcion) + '</p>' +
                            '<h5><span class="badge">S/.' + (childData.precio) + '</span></h5>' +
                        '</div>' +
                        '<button class="btn btn-danger" id="' + (childKey) + '" onclick="eliminarBebidas(this.id)">Eliminar Bebida</button>' +
                    '</li>'
            );
            
        }); 
    })
}

//Eliminar platillos

var eliminarPlatillos = function(id){//id es el key
    database.ref('alimentos/' + id).remove()
    .then(function(){
        alert("Platillo Eliminado")
        console.log('Platillo Eliminado');
        window.location = "platillos.html";
    })
    .catch(function(error){
        console.log("No se borro el platillo" + error)
    })
}

var eliminarBebidas = function(id){
    database.ref('bebidas/' + id).remove()
    .then(function(){
        alert("Bebida Eliminada")
        console.log('Bebida Eliminada');
        window.location = "bebidas.html";
    })
    .catch(function(error){
        console.log("No se borro la bebida " + error)
    })
}

//Comunicador con firebase

function funcionDeLaForma(event) {
    event.preventDefault();
    var nombre= document.getElementById("nombre").value;
    var descripcion= document.getElementById("descripcion").value;
    var precio= document.getElementById("precio").value;
    var imagen= document.getElementById("imgDir").value;
    var texto= document.getElementById("imgTxt").value;

    escribirPlatillo(nombre, descripcion, precio, imagen, texto);
}

function funcionDeLaFormaBebidas(event) {
    event.preventDefault();
    var nombre= document.getElementById("nombre").value;
    var descripcion= document.getElementById("descripcion").value;
    var precio= document.getElementById("precio").value;
    var imagen= document.getElementById("imgDir").value;
    var texto= document.getElementById("imgTxt").value;

    escribirBebidas(nombre, descripcion, precio, imagen, texto);
}

//4)Ver imagen (cargar)

var storage = firebase.storage();
var storageRef = storage.ref(); //referencia al storage

function visualizarArchivo(){
    var preview = document.querySelector("img"); 
    var archivo = document.querySelector('input[type=file]').files[0];
    var lector = new FileReader(); //lee el fichero

    lector.onloadend = function(){ //cuando carga termine, src = visor
        preview.src = lector.result;
    }

    if(archivo){ //si archivo existe lea su direccion
        lector.readAsDataURL(archivo);
        
        //4.1)variable que sube el archivo (hijo->platillos/nombre(API)) con put de firebase
        var subirImagen = storageRef.child('platillos/' + archivo.name).put(archivo);

        subirImagen.on('state_changed', function(snapshot){
            //cambios de carga
        }, function(error){
            console.log("Error en carga de imagen: " + error);
        }, function(){
            console.log(subirImagen.snapshot.downloadURL);
            //4.2) 1-pone la direccion del firebase en el input
            document.getElementById("imgDir").value = subirImagen.snapshot.downloadURL;
        })
    }else{
        preview.src = "";
    }
}

function visualizarArchivoBebidas(){
    var preview = document.querySelector("img"); 
    var archivo = document.querySelector('input[type=file]').files[0];
    var lector = new FileReader(); 

    lector.onloadend = function(){ 
        preview.src = lector.result;
    }

    if(archivo){ 
        lector.readAsDataURL(archivo);
        
        var subirImagen = storageRef.child('bebidas/' + archivo.name).put(archivo);

        subirImagen.on('state_changed', function(snapshot){
         
        }, function(error){
            console.log("Error en carga de imagen: " + error);
        }, function(){
            console.log(subirImagen.snapshot.downloadURL);
          
            document.getElementById("imgDir").value = subirImagen.snapshot.downloadURL;
        })
    }else{
        preview.src = "";
    }
}


/*
            var li = document.createElement("li");
            var div = document.createElement("div");
            var img = document.createElement("img"); 
            var h4 = document.createElement("h4");
            var button = document.createElement("button");

            button.setAttribute("id", childKey);
            button.setAttribute("onclick", "eliminarPlatillos(this.id)");
            button.appendChild(document.createTextNode("Eliminar Platillo"));

            li.className = "list-group-item";
            div.className = "media";
            img.className = "pull-right";
            h4.className = "media-heading";

            img.src = childData.direccion;
            img.alt = childData.texto;
            img.title = childData.texto;
            img.height = 60; 

            div.appendChild(img);
            li.appendChild(div);
            li.appendChild(document.createTextNode("Nombre: " + childData.nombre));
            li.appendChild(document.createTextNode("Descripcion: " + childData.descripcion));
            li.appendChild(document.createTextNode("Precio: " + childData.precio));
            li.appendChild(button);

            ul.appendChild(li); 
*/