//esta funcion debe ser llamada desde un boton para ser proceder a validar el formulario 

function(idFormHtml, validar = true) {
 	/* idFormHtml = id del formulario que desamos deserialziar
 	 *  todos los componentes que se desa deserializar debe tener un 'name' que sera el KEY del json
 	 *  todos los componente a deseralizar deben ser de la clase css '_formJSON'  
 	 *  en caso de que el parametro 'validar' =true, se debe hacer el proceso de validacion de campos
 	 *  input -> 'required=true'  es el tag que sirve para definir si el campo es obligatorio
 	 *  input -> 'requiredMessage' es el mensaje de alerta en caso de ser campo obligatorio  
 	 *  input -> 'maxLength' es el tag del input para especificar la longitud maxima que se permite.
 	 *  input -> 'onlyText' = true es el tag del input para especificar que solo se acepta texto.
 	 *  input -> 'onlyNumber' = true es el tag del input para especificar que solo se acepta números.
 	 *  todos los labels asociados a cada input debe pertenecer a la clase '.form-control-label', para poder cambiar de color
 	 *  cada input/select y su respectivo label debe estar dentro de un div de la clase'.form-group'
 	 *  returna 'false' en caso de haber error
 	 *  retorna json obtenido del form en caso de no haber conflicto	
 	 */

 	var items = document.getElementById(idFormHtml).getElementsByClassName('_formJSON');
 	var json = {};
 	var valorRadio = '';
 	for (var i = 0; i < items.length; i++) {
 		if (items[i].nodeName === 'INPUT' || items[i].nodeName === 'SELECT' || items[i].nodeName === 'TEXTAREA') {
 			if (items[i].getAttribute('type') === 'checkbox') {
 				json[items[i].name] = [];
 			} else {
 				json[items[i].name] = '';
 			}
 		}
 	}

 	for (var i = 0; i < items.length; i++) {
 		if (items[i].nodeName === 'INPUT' || items[i].nodeName === 'SELECT' || items[i].nodeName === 'TEXTAREA') {
 			if (items[i].getAttribute('type') === 'radio') {
 				if (items[i].checked) {
 					json[items[i].name] = items[i].value;
 				}
 			} else if (items[i].getAttribute('type') === 'checkbox') {
 				if (items[i].checked) {
 					json[items[i].name].push(items[i].value);
 				}
 			} else {
 				json[items[i].name] = items[i].value
 			}
 		}
 	}

 	
 	if (validar) {
 		var conflictos = {};
 		var conflicto_num=0;
 		for (var i = 0; i < items.length; i++) {
 			items[i].classList.remove('form-control-warning')
 			items[i].parentNode.classList.remove('has-warning')
 			var conflicto = false;

 			if (items[i].getAttribute('required') === 'true') {
 				if (items[i].getAttribute('type') === 'checkbox') {
 					if (json[items[i].name].length == 0) {
 						conflictos[items[i].name] = items[i];
 						conflicto_num++;
 					}
 				} else if (json[items[i].name] === '') {
 					conflictos[items[i].name] = items[i];
 					conflicto_num++;
 				}
 			}

 			if (items[i].getAttribute('maxLength') !=null) {
 				try {
 					var maxLength=parseInt(items[i].getAttribute('maxLength'));
 					if(json[items[i].name].length > maxLength){
 						items[i].setAttribute('requiredMessage', "El valor el campo '"+items[i].name+"' es demasiado largo, (máximo= "+maxLength+")");
 						conflictos[items[i].name] = items[i];
 						conflicto_num++;
 					}
 				} catch(e) {
 					console.log(e);
 				}
 				
 			}
 			if (items[i].getAttribute('onlyNumber') === 'true') {
 				console.log(items[i])
 				try {
 					
 					if (!/^([0-9])*$/.test(json[items[i].name])){
 						items[i].setAttribute('requiredMessage', "El campo '"+items[i].name+"' solo acepta números ");
 						conflictos[items[i].name] = items[i];
 						conflicto_num++;
 					}
      				   					
 				} catch(e) {
 					console.log(e);
 				}
 				
 			}
 			if (items[i].getAttribute('onlyText') === 'true') {
 				try {
 					if (!/^[A-Z]+$/i.test(json[items[i].name])){
 						items[i].setAttribute('requiredMessage', "El campo '"+items[i].name+"' solo acepta texto ");
 						conflictos[items[i].name] = items[i];
 						conflicto_num++;
 					}
 				} catch(e) {
 					console.log(e);
 				}
 				
 			}
 		}

 		var tieneErrores=false;
 		for (var i in  conflictos) {
 			//mostrar mensaje de error. 
 			tieneErrores=true;
 			var mensaje = conflictos[i].getAttribute('requiredMessage') == null ? 'El campo "' + conflictos[i].name + '" es obligatorio' : conflictos[i].getAttribute('requiredMessage')
 			alert(mensaje);
      
 			conflictos[i].classList.add('form-control-warning')
 			conflictos[i].parentNode.classList.add('has-warning')
 		}
 		if(tieneErrores){
 			return null;
 		}

 	}

 	return json;
 };
