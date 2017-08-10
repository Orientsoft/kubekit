
# ios7-switch

  
  Personally I really don’t like mimicking native UIs, but I find it interesting to see how these tiny interactions work on iOS7 `Switch`.

  So I did a quick research to find out how those tiny bits are moving around :)

  ![](http://c.mnmly.com/PbZY/2013-06-12%2011_56_23.gif)
  

  ☞ [Demo]
  
  


  Here’s the major frames of turning on / turning off interaction.

  ![](http://c.mnmly.com/PbVC/Slice%201@2x.png)


  [Demo]: http://mnmly.github.com/ios7-switch/


## Installation

    $ component install mnmly/ios7-switch

## Example

```javascript
var Switch = require('ios7-switch')
  , checkbox = document.querySelector('input')
  , mySwitch = new Switch(checkbox);

// When `mySwitch` is clicked toggle state
mySwitch.el.addEventListener('click', function(e){
  e.preventDefault();
  mySwitch.toggle();
}, false)
```

   

## License

  MIT
