# Fabricator JavaScript Data Modeling

While this component is designed with the [BuzzingPixel Fabricator Build Process](https://github.com/tjdraper/buzzing-pixel-fabricator) in mind, it can be used anywhere (in theory).

A Fabricator Model is a way to store specified data, have it properly validated as the type declared, and watch for change events to the data.

## Installing

With Fabricator and NPM, simply require this library into your project and restart the Fabricator Grunt build process.

`npm install fab.model --save`

If you are not using Fabricator, you will need to in some manner compile `src/FAB.model.js` into your build process or put it somewhere where you can link it into your projects.

## `FAB.model.make()`

Returns: constructor

The `make` function takes one argument: an object of keys and values where the keys are the model properties you want to have, and the value is one of the following:

- int
- float
- string
- bool
- array
- object

## Constructing a model

You can use the `new` keyword on the return value of `FAB.model.make()`. The constructor takes one argument: an object of default values to set on the model's initial properties.

### `myModel.get('myProperty);`

The getter get's the current value of a model property. If the property is not declared when creating a constructor, `null` is returned when trying to get a non-existent property. Only the declared data type is returned.

### `myModel.set('myProperty', 'myVal')`

The setter sets the model property. Only the declared data type is allowed to be set.

### `myModel.onChange('myProperty', function() {})`

Watches for changes on the property. You can also namespace the property watcher so you can specifically "off" the watcher later: `myModel.onChange('myProperty.myNamespace', function() {})`

### `myModel.offChange('myProperty')`

Stop watching for any changes on that model property. Additionally, you can off only a specific namespace: `myModel.offChange('myProperty.myNamespace')`
