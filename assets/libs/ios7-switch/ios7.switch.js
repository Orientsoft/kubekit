
/**
 * Accept one checkbox input field, and convert it into iOS style switch UI.
 */

function Switch(input) {
  if ('checkbox' !== input.type) throw new Error('You can\'t make Switch out of non-checkbox input');

  this.input = input;
  this.input.style.display = 'none'; // hide the actual input

  this.el = document.createElement('div');
  $(this.input).removeClass("ios-switch");
  this.el.className = 'iswitch '+$(this.input).attr("class");
  this._prepareDOM();
  
  this.input.parentElement.insertBefore(this.el, this.input);

  // read initial state and set Switch state accordingly
  if (this.input.checked) this.turnOn()
  var ele = this;
  this.el.addEventListener('click', function(e){
      e.preventDefault();
      ele.toggle();
    }, false);
}


/**
 * Toggles on/off state
 */

Switch.prototype.toggle = function() {

  if(this.el.classList.contains('on')){
    this.turnOff();
  } else {
    this.turnOn();
  }

  this.triggerChange();
};


/**
 * Turn on
 */

Switch.prototype.turnOn = function() {
  this.el.classList.add('on');
  this.el.classList.remove('off');
  this.input.checked = true;
};

/**
 * Turn off
 */

Switch.prototype.turnOff = function() {
  this.el.classList.remove('on');
  this.el.classList.add('off');
  this.input.checked = false;
}


/**
 * Triggers DOM event programatically on the real input field
 */

Switch.prototype.triggerChange = function() {
  if ("fireEvent" in this.input){
    this.input.fireEvent("onchange");
  } else {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    this.input.dispatchEvent(evt);
  }
};

/**
 * We need to prepare some DOM elements
 */

Switch.prototype._prepareDOM = function() {

  var onBackground = document.createElement('div');
  onBackground.className = 'on-background background-fill';

  var stateBackground = document.createElement('div');
  stateBackground.className = 'state-background background-fill';
  
  var handle = document.createElement('div');
  handle.className = 'handle';
    
  this.el.appendChild(onBackground);
  this.el.appendChild(stateBackground);
  this.el.appendChild(handle);

};

