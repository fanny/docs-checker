# Docs Checker


## Introduction
`docs-checker` is a tool for identifying markdown documentation structures and verifying that they follow the same pattern provided by the user. Curious to know how?

- docs-checker uses [`markdown-it`](https://github.com/markdown-it/markdown-it) for markdown analysis
- docs-checker uses an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) with regex to evaluate standards in the documentation structure
- docs-checker uses [`moenda`](https://github.com/SPLAB-UFCG/Moenda) the engine responsible for executing the rules.

docs-checker is also flexible, so if you want to create your custom rule, follow [this tutorial](#custom-rules).


## Installation and Usage

> Prerequisites:    
> 1. [Node.js](https://nodejs.org/en/) (>=14.0.0)  
> 2. [Moenda](https://github.com/SPLAB-UFCG/Moenda): Moenda is still 🚧 under development 🚧 so currently you need to clone the repo and put under the same root directory of `docs-checker`

You can install docs-checker using npm:

`npm install docs-checker`

Then you will be able to use the package running the following command:

`docs-checker run <files.md>`

You'll get an output similar to that:

![](https://i.imgur.com/2SSNm2y.png)

## Configuration

Because docs-checker is designed to be flexible and configurable for your use case, you can specify your own configuration rather than follow the [default](https://github.com/fanny/docs-checker/blob/master/src/config.json) one. Using a **JSON** file named `config.json`, you can specify rules and it's configs as showed below:

**config.json**
```json
{
    "rules": {
        "require-structure": {
            "h1": {"p": "required"},
            "h2": [{"p": "required", "h3": "optional"}, {"h3"}]
        },
    }
}
```

You can also turn off any rule that you want using "false" on the configs, or by providing a comment on markdown

**config.json**
```json
{
    "rules": {
        "require-structure": false
    }
}
```
**markdown inline config**
```md
<!--docs-checker-disable require-structure-->
```

## Default Rules

Currently `docs-checker` has only one rule, [`require-structure`](https://github.com/fanny/docs-checker/blob/master/src/rules/requireStructure.js). This rule is responsible to check if a markdown documentation follow the structure specified.


## Custom Rules

Each rule is represented by a single object with some properties and one method.

```js
module.exports = {
    name: 'my-great-rule',
    tags: ['md', 'docs'],
    description: 'Checks if documentation contains title',
    run: function rule(params, onError){
        // ..
    }
};
```
- `name` - The rule name. This is used as an identifier to configure docs-checker on the command line
- `tags` - A human readable list of tags that help others users to identify what this rule is about.
- `description` - A human readable description for the rule. This is used in the cli to describe the rule.
- `run` - The one method is run(), which sets up the rule. This method is passed in two arguments, `params` and a reporter function.
`params` contains two objects, `context` and `rule configs`. The context object contains additional functionality that is helpful for rules to do their jobs, is a result of parser processing while the rule configs are the configs provided by the user using `config.json` file. The `reporter` is a function used to report a problem in the structure.

After define your custom rule you'll need to define where those rules are located in your `config.json` file

```json
{
    "custom-rules": "path/to/my-rules-module",
    "rules": {
        "require-structure": {
            "h1": {"p": "required"},
            "h2": [{"p": "required", "h3": "optional"}, {"h3"}]
        },
    }
}
```






