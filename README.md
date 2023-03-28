# Angular Grid System

## Angular library to create a simple grid layout

[![npm](https://ico.y.gy/npm/dm/@marxlnfcs/ngx-grid?style=flat-square&logo=npm)](https://www.npmjs.com/package/@marxlnfcs/ngx-grid)
[![NPM](https://ico.y.gy/npm/l/@marxlnfcs/ngx-grid?style=flat-square&color=brightgreen)](https://www.npmjs.com/package/@marxlnfcs/ngx-grid)
[![Snyk Vulnerabilities for npm package](https://ico.y.gy/snyk/vulnerabilities/npm/@marxlnfcs/ngx-grid?style=flat-square&logo=snyk)](https://snyk.io/test/npm/@marxlnfcs/ngx-grid)
[![Website](https://ico.y.gy/website?down_color=red&down_message=offline&label=repository&up_color=success&up_message=online&url=https%3A%2F%2Fgithub.com%2Fmarxlnfcs%2Fngx-grid&style=flat-square&logo=github)](https://github.com/marxlnfcs/ngx-grid)

![ngx-grid](https://raw.githubusercontent.com/marxlnfcs/ngx-grid/main/preview.jpg "ngx-grid preview")

## Installation
`npm i @marxlnfcs/ngx-grid`

## Usage

---

#
### Module:
Import `NgxGridModule` from `@marxlnfcs/ngx-grid`

```javascript
import { NgxGridModule } from '@marxlnfcs/ngx-grid';

@NgModule({
  imports: [
    NgxGridModule
  ]
})
```
#
### Grid component
Simple component to build a dynamic and easy to use grid layout
```javascript
<ngx-grid>
  <ngx-grid-column>...</ngx-grid-column>
  <ngx-grid-column>...</ngx-grid-column>
  <ngx-grid-group>
    <ngx-grid-column>...</ngx-grid-column>
    <ngx-grid-column>...</ngx-grid-column>
  </ngx-grid-group>
</ngx-grid>
```

#
#### Options for Grid component: `<ngx-grid>`
* `baseBreakpoint` - Defines the base breakpoint of this component. (default is `xs`), Possible values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
* `baseSize` - Defines the default column size of the grid. (default is `12`), Possible values: 2, 4, 6, 8, 10, 12
* `gap` - Sets the spacing between all columns and rows. (default is `1rem`)
* `columnGap` - Sets the spacing between all columns. (default is the value of the `gap` option)
* `rowGap` - Sets the spacing between all rows. (default is the value of the `gap` option)
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `true`)
* `rows` - Accepts a list of strings to define the size of each row statically. (default is `null`)

#
#### Options for the grid column directive: `<ngx-grid-column>`
For every directive there are multiple `size`, `offset` and `order` options for each breakpoint.
The `[size]`, `[offset]` and `[order]` input uses the current base breakpoint.

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` and `4xl`
Sizes: `1-12`
Offset sizes: `2`, `4`, `6`, `8`, `10`

* `size` - Sets the width (1-12) of the column. (default is `12`)
* `*:size` - Sets the width (1-12) of the column. (default is `12`)
* `offset` - Sets the distance from the left. (default is `null`)
* `*:offset` - Sets the distance from the left. (default is `null`)
* `order` - Sets the position of the column. (default is `null`)
* `*:order` - Sets the position of the column. (default is `null`)

#
#### Options for the grid group directive: `<ngx-grid-group>`
For every directive there are multiple `size`, `offset` and `order` options for each breakpoint.
The `[size]`, `[offset]` and `[order]` input uses the current base breakpoint.

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` and `4xl`
Sizes: `1-12`
Offset sizes: `2`, `4`, `6`, `8`, `10`

* `gap` - Sets the spacing between all columns and rows. (default is `1rem`)
* `columnGap` - Sets the spacing between all columns. (default is the value of the `gap` option)
* `rowGap` - Sets the spacing between all rows. (default is the value of the `gap` option)
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `true`)
* `rows` - Accepts a list of strings to define the size of each row statically. (default is `null`)
* `size` - Sets the width (1-12) of the column. (default is `12`)
* `*:size` - Sets the width (1-12) of the column. (default is `12`)
* `offset` - Sets the distance from the left. (default is `null`)
* `*:offset` - Sets the distance from the left. (default is `null`)
* `order` - Sets the position of the column. (default is `null`)
* `*:order` - Sets the position of the column. (default is `null`)

#
### Grid centered component
Simple component to center a specific size of container
```javascript
<ngx-grid-centered>
  ...
</ngx-grid-centered>
```

#
#### Options for the grid centered component: `<ngx-grid-centered>`
For every breakpoint, there is a native `size` option.
The `[size]` input uses the current base breakpoint.

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` and `4xl`
Sizes: `1-12`

* `size` - Sets the width (1-12) of the column. (default is `12`)
* `*:size` - Sets the width (1-12) of the column. (default is `12`)
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `true`)


#
## Global Options

---
In the `forRoot` method when importing the grid module in the app module you can specify the following options that will be globally applied to all grid instances.
* `baseBreakpoint` - Defines the base breakpoint of this component. (default is `xs`), Possible values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
* `baseSize` - Defines the default column size of the grid. (default is `12`), Possible values: 2, 4, 6, 8, 10, 12
* `gap` - Sets the spacing between all columns and rows. (default is `1rem`)
* `columnGap` - Sets the spacing between all columns. (default is the value of the `gap` option)
* `rowGap` - Sets the spacing between all rows. (default is the value of the `gap` option)
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `true`)
