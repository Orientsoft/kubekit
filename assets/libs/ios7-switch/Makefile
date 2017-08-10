
build: components index.js ios7-switch.css
	@component build --dev

ios7-switch.css: ios7-switch.styl
	@styl -w < ios7-switch.styl > ios7-switch.css


components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
