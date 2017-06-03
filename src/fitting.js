function FittingModals(){
	var fitting = this;
	/********* DEFAULT SETTINGS *********/
	fitting.parent = "body";
	fitting.container = "div";
	fitting.class = "";
	fitting.content_type = "text"; // [text, alert, confirm, html, form]
	fitting.effect = "slide"; // [fade,slide,scale,blur]
	fitting.style = "dark"; // [dark,light,custom]
	fitting.outter_click = true; // [true,false]
	fitting.title = "fitting.js";
	fitting.close = "Close";
	fitting.alert = "";
	fitting.html = "";
	fitting.text = "";
	fitting.confirm_fields = [];
	fitting.form_fields = [];
	fitting.method = "POST";
	fitting.submit_txt = "Send";
	fitting.gui = { container: "", header: "", header_button: "", content: "", content_html: "", content_button:""};
	/* EVENTS */
	fitting.onshow = function(){};
	fitting.onhide = function(){};
	fitting.onsubmit = function(){};
	fitting.onconfirm = function(){};
	/************************************/
	fitting.parent_element = document.getElementById(fitting.parent);
	fitting.init = function(params){
		if(params !== undefined){
			fitting.parent = params.parent === undefined ? "body" : params.parent;
			fitting.container = params.container === undefined ? "div" : params.container;
			fitting.class = params.class === undefined ? "" : params.class;
			fitting.content_type = params.content_type === undefined ? "text" : params.content_type; // [text, alert, confirm, html, form]
			fitting.effect = params.effect === undefined ? "fade" : params.effect; // [fade,slide,scale,blur]
			fitting.style = params.style === undefined ? "dark" : params.style; // [dark,light, custom]
			fitting.outter_click = params.outter_click === undefined ? true : params.outter_click; // [true,false]
			fitting.title = params.title === undefined ? "" : params.title;
			fitting.close = params.close === undefined ? "Close" : params.close;
			fitting.text = params.text === undefined ? "" : params.text;
			fitting.alert = params.alert === undefined ? "" : params.alert;
			fitting.method = params.method === undefined ? "POST" : params.method;
			fitting.submit_txt = params.submit_txt === undefined ? "" : params.submit_txt;
			fitting.html = params.html === undefined ? "" : params.html;
			fitting.form_fields = params.form_fields === undefined ? [] : params.form_fields;
			fitting.confirm_fields = params.confirm_fields === undefined ? [] : params.confirm_fields;
			fitting.gui = { container: "", header: "", header_button: "", content: "", content_button:""};
			if(params.gui !== undefined){
				fitting.gui = {
					container: params.gui.container === undefined ? "" : params.gui.container,
					header: params.gui.header === undefined ? "" : params.gui.header,
					header_button: params.gui.header_button === undefined ? "" : params.gui.header_button,
					content: params.gui.content === undefined ? "" : params.gui.content,
					content_html: params.gui.content_html === undefined ? "" : params.gui.content_html,
					content_button: params.gui.content_button === undefined ? "" : params.gui.content_button
				};
			}
			/* EVENTS */
			fitting.onshow = params.onshow === undefined ? function(){} : params.onshow;
			fitting.onhide = params.onhide === undefined ? function(){} : params.onhide;
			fitting.onsubmit = params.onsubmit === undefined ? function(){} : params.onsubmit;
			fitting.onconfirm = params.onconfirm === undefined ? function(){} : params.onconfirm;
			fitting.parent_element = document.querySelector(fitting.parent);
		}
	}
	fitting.show = function(append_type){
		fitting.element = document.createElement(fitting.container);
		fitting.element.classList.add('fitting_container');
		fitting.element.classList.add(fitting.style);
		fitting.element.classList.add(fitting.effect);
		fitting.element.classList.add("type_"+fitting.content_type);
		fitting.element.classList.add(fitting.title === undefined || fitting.title === "" ? "fitting_no_title" : "fitting_with_title");
		fitting.element.setAttribute("style", fitting.gui.container);
		fitting.element.innerHTML =
			'<div class="fitting_wrapper">'+
				'<div class="fitting_modal '+fitting.class+'">'+
					'<div class="fitting_title" style="'+fitting.gui.header+'">' +
						(fitting.title === undefined || fitting.title === "" ? "" : '<h3>'+fitting.title+'</h3>') +
						'<a href="javascript:;" class="fitting_close" style="'+fitting.gui.header_button+'">'+fitting.close+'</a>'+
					'</div>'+
					'<div class="fitting_content" style="'+fitting.gui.content+'">'+fitting.content()+'</div>'+
				'</div>'+
			'</div>';
		if(append_type !== undefined && append_type === "prepend"){
			fitting.parent_element.insertBefore(fitting.element, fitting.parent_element.firstChild);
		} else {
			fitting.parent_element.appendChild(fitting.element);
		}
		fitting.resize();
		if(fitting.content_type === "form"){
			document.querySelector("#fitting_form").onsubmit = function(e){
				fitting.onsubmit(fitting.serialize(), e);
			};
			document.querySelector("#fitting_form").submit = function(e){
				fitting.onsubmit(fitting.serialize(), e);
			};
		} else if(fitting.content_type === "confirm"){
			document.querySelector("#fitting_form").onsubmit = function(e){
				fitting.onconfirm(e.value);
			};
			document.querySelector("#fitting_form").submit = function(e){
				fitting.onconfirm(e.value);
			};
		}
		var close_event = new Event('close_fitting');
		if(fitting.outter_click === true){
			document.querySelector('.fitting_modal').onclick = function(e){
				e.stopPropagation();
			};
			document.querySelector('.fitting_wrapper').onclick = function(e){
				document.dispatchEvent(close_event);
			};
		}
		document.querySelector('.fitting_close').onclick = function(e){
			document.dispatchEvent(close_event);
		};
		setTimeout(function(){
			document.addEventListener("close_fitting", fitting.hide);
			document.querySelector('.fitting_container').classList.add("active");
			fitting.onshow();
		},100);
	}
	fitting.hide = function(){
		document.querySelector('.fitting_container').classList.remove("active");
		setTimeout(function(){
			document.removeEventListener("close_fitting", function(){});
			fitting.parent_element.removeChild(fitting.element);
			fitting.onhide();
		},300);
	}
	fitting.content = function(){
		if(fitting !== undefined){
			switch(fitting.content_type){
				case "text":
					return fitting.text === undefined || fitting.text === "" ? "<p class='fitting_content_text'></p>" : "<p class='fitting_content_text'>"+fitting.text+"</p>";
				break;
				case "alert":
					return fitting.alert === undefined || fitting.alert === "" ? "<p class='fitting_content_alert'></p>" : "<p class='fitting_content_alert'>"+fitting.alert+"</p>";
				break;
				case "confirm":
					if( fitting.confirm_fields === undefined || fitting.confirm_fields.length < 1){
					 	return "<form id='fitting_form' class='fitting_content_confirm' method='"+fitting.method+"'><p>Missing confirm_fields!</p></form>";
					} else {
						var mkp =
						"<form id='fitting_form' class='fitting_content_confirm' method='"+fitting.method+"'>";
							mkp += fitting.text === undefined || fitting.text === "" ? "" : "<p class='fitting_content_text'>"+fitting.text+"</p>";
							mkp += "<div class='fitting_griddy wrap'>";
								for (var i = 0; i < fitting.confirm_fields.length; i++) {
									var btn = "<div class='fitting_col' style='flex-grow:1'>";
										if( fitting.confirm_fields[i].label !== undefined && fitting.confirm_fields[i].value !== undefined &&
											fitting.confirm_fields[i].label !== "" && fitting.confirm_fields[i].value !== ""){
											btn += "<label class='fitting_button_confirm btn"+i+"' style='"+fitting.gui.content_button+"'>"+fitting.confirm_fields[i].label+" <input type='radio' name='confirm' value='"+fitting.confirm_fields[i].value+"' onchange='document.getElementById(\"fitting_form\").submit(this)'></label>";
										}
									btn += "</div>";
									mkp += btn;
								}
							mkp += "</div>"+
						"</form>";
						return mkp;
					}
				break;
				case "html":
					if( fitting.html === undefined || fitting.html === ""){
				 		return "<div class='fitting_content_html' style='"+fitting.gui.content_html+"'></div>";
					} else {
						return "<div class='fitting_content_html' style='"+fitting.gui.content_html+"'>"+fitting.html+"</div>";
					}
				break;
				case "form":
					if( fitting.form_fields === undefined || fitting.form_fields.length < 1){
						return "<form id='fitting_form' class='fitting_content_form' method='"+fitting.method+"'></form>";
					} else {
						var mkp =
						"<form id='fitting_form' class='fitting_content_form' method='"+fitting.method+"'>";
							mkp += fitting.html === undefined || fitting.html === "" ? "" : "<div class='fitting_html' style='"+fitting.gui.content_html+"'>"+fitting.html+"</div>";
							mkp += "<div class='fitting_griddy wrap'>";
								for (var i = 0; i < fitting.form_fields.length; i++){
									var FieldData = fitting.form_fields[i];
									var FieldParams = {};
									if( FieldData.name === undefined && FieldData.placeholder === undefined){
										FieldParams.name = '';
										FieldParams.placeholder = 'Define a placeholder';
									} else if(FieldData.name !== undefined && FieldData.placeholder === undefined){
										FieldParams.name = FieldData.name;
										FieldParams.placeholder = 'Define a placeholder';
									} else if(FieldData.name === undefined && FieldData.placeholder !== undefined){
										FieldParams.name = '';
										FieldParams.placeholder = FieldData.placeholder;
									} else {
										FieldParams.name = FieldData.name;
										FieldParams.placeholder = FieldData.placeholder;
									}
									if( FieldData.value === undefined ){
										FieldParams.value = "";
									} else {
										FieldParams.value = FieldData.value;
									}
									if( FieldData.required !== undefined && FieldData.required === true){
										FieldParams.required = " required='required' ";
									} else {
										FieldParams.required = " ";
									}
									var formfield =
									"<div class='fitting_col col_"+FieldData.type+"' style='flex-grow:1'>" +
										"<div class='formfield'>";
											if( FieldData.label === undefined){
												formfield += "<label>Define a label</label>";
											} else {
												formfield += "<label>"+FieldData.label+"</label>";
											}
											formfield += "<div class='margin_fix'>";

												if( FieldData.type === undefined || FieldData.type === ""){
													formfield += "<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_text' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='text'>";
												} else {
													switch(FieldData.type){
														case "text":
															formfield +=
																"<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='text'>";
														break;
														case "number":
															formfield +=
																"<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='number'>";
														break;
														case "email":
															formfield +=
																"<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='email'>";
														break;
														case "checkbox":
															formfield +=
																"<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='checkbox'>";
														break;
														case "radio":
															formfield +=
																"<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='radio'>";
														break;
														case "tel":
															formfield +=
																"<input "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"' type='tel'>";
														break;
														case "textarea":
															formfield +=
																"<textarea "+FieldParams.required+" value='"+FieldParams.value+"' class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"' placeholder='"+FieldParams.placeholder+"'>"+FieldParams.value+"</textarea>";

														break;
														case "select":
															if( FieldData.options === undefined ){
																FieldParams.options = [];
															} else {
																FieldParams.options = FieldData.options;
															}
															formfield += "<select "+FieldParams.required+" class='fitting_"+FieldData.type+"' name='"+FieldParams.name+"'>";
																if(FieldParams.value === ""){
																	formfield += "<option value='' selected disabled>"+FieldParams.placeholder+"</option>";
																} else {
																	formfield += "<option value='' disabled>"+FieldParams.placeholder+"</option>";
																}
																for (var v = 0; v < FieldParams.options.length; v++) {
																	if(FieldParams.value !== "" && FieldParams.options[i].value === FieldParams.value){
																		formfield += "<option value='"+FieldParams.options[v].value+"' selected>"+FieldParams.options[v].label+"</option>";
																	} else {
																		formfield += "<option value='"+FieldParams.options[v].value+"'>"+FieldParams.options[v].label+"</option>";
																	}
																}
															formfield += "</select>";
														break;
														default: console.warn(FieldData.type+" is not recognized!");
													}
												}
											formfield += "</div>"+
										"</div>"+
									"</div>";
									mkp += formfield;
								}
								mkp +=
									"<div class='fitting_col' style='min-width:100%;'>";
										mkp += fitting.text === undefined || fitting.text === "" ? "" : "<p class='fitting_content_text'>"+fitting.text+"</p>";
										mkp += "<div class='fitting_submit'>"+
											"<button type='submit' style='"+fitting.gui.content_button+"'>"+(fitting.submit_txt === undefined || fitting.submit_txt === "" ? "Submit" : fitting.submit_txt)+"</button>"+
										"</div>"+
									"</div>";
							mkp += "</div>"+
						"</form>";
						return mkp;
					}
				break;
				default: return;
			}
		} else {
			return;
		}
	}
	fitting.serialize = function(){
		var form = fitting.parent_element.getElementsByTagName('form')[0];
	  	var objects = {};
	  	if (typeof form == 'object' && form.nodeName.toLowerCase() == "form") {
			var fields = form.getElementsByTagName("input");
			for(var i=0;i<fields.length;i++){
	    		objects[fields[i].getAttribute("name")] = fields[i].value;
			}
			var selects = form.getElementsByTagName("select");
			for(var i=0;i<selects.length;i++){
	    		objects[selects[i].getAttribute("name")] = selects[i].value;
			}
			var textareas = form.getElementsByTagName("textarea");
			for(var i=0;i<textareas.length;i++){
	    		objects[textareas[i].getAttribute("name")] = textareas[i].value;
			}
	  	}
	  	return JSON.stringify(objects);
	}
	fitting.resize = function(){
		fitting.fitting_modal = document.querySelector('.fitting_modal');
		fitting.fitting_title = document.querySelector('.fitting_title');
		fitting.fitting_content = document.querySelector('.fitting_content');
		var fitting_style = window.getComputedStyle(fitting.fitting_modal, null);
		var fitting_title_style = window.getComputedStyle(fitting.fitting_title, null);
		var fitting_content_style = window.getComputedStyle(fitting.fitting_content, null);
		var fitting_content_child_style = window.getComputedStyle(fitting.fitting_content.firstChild, null);
		fitting.fitting_height =
			parseInt(fitting_title_style.getPropertyValue("height")) +
			parseInt(fitting_title_style.getPropertyValue("padding-top")) +
			parseInt(fitting_title_style.getPropertyValue("padding-bottom")) +
			parseInt(fitting_content_style.getPropertyValue("padding-top")) +
			parseInt(fitting_content_style.getPropertyValue("padding-bottom")) +
			parseInt(fitting_content_child_style.getPropertyValue("height")) +
			parseInt(fitting_content_child_style.getPropertyValue("padding-top")) +
			parseInt(fitting_content_child_style.getPropertyValue("padding-bottom"));
		fitting.fitting_margin = parseInt((fitting.parent_element.offsetHeight - fitting.fitting_height) / 2);
		fitting.fitting_modal.style.height = fitting.fitting_height+"px";
		fitting.fitting_modal.style.marginTop = Math.max(0,fitting.fitting_margin)+"px";
		fitting.fitting_modal.style.marginBottom = Math.max(0,fitting.fitting_margin)+"px";
	}
	window.addEventListener("resize", function(){
		fitting.resize();
	});
	return fitting;
}
