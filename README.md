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


## Configuration

Because docs-checker is designed to be flexible and configurable for your use case, you can specify your own configuration rather than follow the [default](https://github.com/fanny/docs-checker/blob/master/src/config.json) one. Using a **JSON** file named `config.json`, you can specify rules and it's configs as showed below:

**config.json**
```json
{
    "rules": {
        "require-structure": {
            "h1": {"p": "required"},
            "h2": [{"p": "required", "h3": "optional"}, {"h3"}]
            // ...
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


## Custom Rules



## Contributing







