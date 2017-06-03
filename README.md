# fitting.js
Simple, fast, multipurpose, recyclable, customizable and dependency free modals!

# Usage

### Include the library files
```html
<link rel="stylesheet" href="fitting.min.css">
<script type="text/javascript" src="fitting.min.js"></script>
```

### Create your modal object
```javascript
  var your_modal = new FittingModals();
```

### Define your modal options
```javascript
  var options = {
    parent : "body", // parent element: [tag, #id, .class]
    container : "div", // container tag
    content_type : "form", // options: [text, alert, confirm, html, form]
    class : "",  // fitting custom class
    effect : "slide", // options: [slide, fade, scale, blur]
    style: "dark", // options: [dark, light, custom]
    outter_click : true, // should we close the modal when clicking the parent?
    title : "Contact Form", // modal title
    close: '<i class="material-icons icon">&#xE14C;</i>', // close button markup
    html: "<p>Submit this form so we can contact you!</p>", // html markup (visible in "content_type: form" and "content_type: html")
    submit_txt: "Submit", // submit button text (visible in "content_type: form")
    text: "(*) required fields", // text helper (visible in "content_type: form", "content_type: alert", "content_type: text")
    gui: { // custom styling uses CSS markup for each customizable element
      container: "",
      header: "",
      header_button: "",
      content: "",
      content_html: "",
      content_button: ""
    },
    confirm_fields: [ // available options when creating a confirmation modal
      {
        label: "Accept",
        value: "true"
      },{
        label: "Cancel",
        value: "false"
      }
    ],
    form_fields: [ // form fields when creating a form modal -> types: [text, number, email, checkbox, radio, tel, textarea, select]
      {
        label: "First Name",
        name: "first_name",
        type: "text",
        placeholder: "Insert your first name (*)",
        value: "",
        required: true
      },{
        label: "Last Name",
        name: "last_name",
        type: "text",
        placeholder: "Insert your last name (*)",
        value: "",
        required: true
      },{
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Insert a valid email (*)",
        value: "",
        required: true
      },{
        label: "Telephone",
        name: "tel",
        type: "tel",
        placeholder: "Insert a telephone number",
        value: "",
        required: false
      },{
        label: "Subject",
        name: "subject",
        type: "text",
        placeholder: "Insert a subject",
        value: "",
        required: false
      },{
        label: "How did you hear about us?",
        name: "source",
        type: "select",
        placeholder: "Select an option",
        options:[ // options available in the select box
          { label: "Website advert", value: "web_advert"},
          { label: "Facebook", value: "facebook"},
          { label: "Twitter", value: "twitter"},
          { label: "Other", value: "other"}
        ],
        required: true
      },{
        label: "Message",
        name: "message",
        type: "textarea",
        placeholder: "Insert your message (*)",
        value: "",
        required: true
      }
    ],
    onshow: function(){
      // fired when the modal is visible
    },
    onhide: function(){
      // fired when the modal is hidden
    },
    onsubmit: function(json, event){
      // fired when the form is submitted
      event.preventDefault();
    },
    onconfirm: function(value){
      // fired when the form is confirmed
      return false;
    }
  };
```

### Initialize your modal options
```javascript
  // You can reset the options and fire a new modal anytime you want.
  your_modal.init(options);
```

### Show your modal
```javascript
  your_modal.show();
```

### Hide your modal
```javascript
  your_modal.hide();
```

## Enjoy your modal!

# License
[MIT](https://github.com/Reaktive/fitting.js/blob/master/LICENSE)

