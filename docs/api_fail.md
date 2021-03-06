[Grunt homepage](https://github.com/cowboy/grunt) | [Documentation table of contents](toc.md)

# [The grunt API](api.md) / grunt.fail

For when something goes horribly wrong.

See the [fail lib source](../lib/grunt/fail.js) for more information.

## The fail API <a name="the-fail-api" href="#the-fail-api" title="Link to this section">⚑</a>

If something explodes (or is about to explode) inside a helper or task, it can force grunt to abort. See the [exit codes documentation](exit_codes.md) for a list of all built-in grunt exit codes.

Note that any method marked with a ☃ (unicode snowman) is also available directly on the `grunt` object. Just so you know. See the [API main page](api.md) for more usage information.

### grunt.warn ☃ <a name="grunt-warn" href="#grunt-warn" title="Link to this section">⚑</a>
Display a warning and abort grunt immediately. Grunt will continue processing tasks if the `--force` command-line option was specified. The `error` argument can be a string message or an error object.

```javascript
grunt.warn(error [, errorcode])
```

If `--debug 9` is specified on the command-line and an error object was specified, a stack trace will be logged.

_This method is also available as [grunt.warn](api.md)._

### grunt.fatal ☃ <a name="grunt-fatal" href="#grunt-fatal" title="Link to this section">⚑</a>
Display a warning and abort grunt immediately. The `error` argument can be a string message or an error object.

```javascript
grunt.fail(error [, errorcode])
```

If `--debug 9` is specified on the command-line and an error object was specified, a stack trace will be logged.

_This method is also available as [grunt.fatal](api.md)._
