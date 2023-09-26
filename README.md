<p align="center" style="font-size: 40px;">Angular Grid System</p>

<p align="center">Angular library to create a simple grid layout</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@marxlnfcs/ngx-grid" target="_blank"><img src="https://img.shields.io/npm/v/@marxlnfcs/ngx-grid.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/ngx-grid" target="_blank"><img src="https://img.shields.io/npm/l/@marxlnfcs/ngx-grid.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/ngx-grid" target="_blank"><img src="https://img.shields.io/npm/dm/@marxlnfcs/ngx-grid.svg" alt="NPM Downloads" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/ngx-grid" target="_blank"><img src="https://img.shields.io/bundlephobia/min/@marxlnfcs/ngx-grid?label=size" alt="Package Size" /></a>
</p>

![ngx-grid](https://raw.githubusercontent.com/marxlnfcs/ngx-grid/main/preview.jpg "ngx-grid preview")

## Installation
`npm i @marxlnfcs/ngx-grid`

## Usage

---

#
### Module:
Import `NgxGridModule` from `@marxlnfcs/ngx-grid`

```typescript
import { NgxGridModule } from '@marxlnfcs/ngx-grid-alt';

@NgModule({
  imports: [
    NgxGridModule.forRoot({ ... })
  ]
})
```
#
### Grid component
Simple component to build a dynamic and easy to use grid layout
```html
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
* `strategy` - Defines the strategy of the grid component. SCREEN uses the media queries and CONTAINER uses the container queries which is experimental, Possible values: screen, container
* `baseBreakpoint` - Defines the base breakpoint of this component. (default is `xs`), Possible values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 'mobile', 'tablet', 'desktop'
* `baseSize` - Defines the default column size of the grid. (default is `12`), Possible values: 2, 4, 6, 8, 10, 12
* `gap` - Sets the spacing between all columns and rows. (default is `1rem`)
* `columnGap` - Sets the spacing between all columns. (default is the value of the `gap` option)
* `rowGap` - Sets the spacing between all rows. (default is the value of the `gap` option)
* `breakpointGaps` - Defines the base gap for every breakpoint, Possible values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 'mobile', 'tablet', 'desktop'
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `false`)
* `rows` - Accepts a list of strings to define the size of each row statically. (default is `null`)

#
#### Options for the grid column directive: `<ngx-grid-column>`
For every directive there are multiple `size`, `offset` and `order` options for each breakpoint.
The `[size]`, `[offset]` and `[order]` input uses the current base breakpoint.

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `mobile`, `tablet` and `desktop`
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

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `mobile`, `tablet` and `desktop`
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
```html
<ngx-grid-centered>
  ...
</ngx-grid-centered>
```

#
#### Options for the grid centered component: `<ngx-grid-centered>`
For every breakpoint, there is a native `size` option.
The `[size]` input uses the current base breakpoint.

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `mobile`, `tablet` and `desktop`
Sizes: `1-12`

* `size` - Sets the width (1-12) of the column. (default is `12`)
* `*:size` - Sets the width (1-12) of the column. (default is `12`)
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `false`)

#
### *ngxScreenSize structural directive
Structural directive to add/remove an element if the defined breakpoint fits.
```html
<div *ngxScreenSize"'xs'">
...
</div>
```

#
### [*.class] and [*.style] directive
Directive to add classes and/or styles based on the breakpoint
```html
<div
  [xs.class]="'class1, class2'"
  [xs.class]="['class1', 'class2']"
  [xs.class]="{ class1: true, class2: true }"

  [xs.style]="'display: none; color: black;'"
  [xs.style]="['display: none', 'color: black; background-color: green;']"
  [xs.style]="{ 'display': 'none', 'color': 'black' }"
>
  ...
</div>
```


#
## Global Options

---
In the `forRoot` method when importing the grid module in the app module you can specify the following options that will be globally applied to all grid instances.
* `strategy` - Defines the strategy of the grid component. SCREEN uses the media queries and CONTAINER uses the container queries which is still experimental, Possible values: screen, container
* `baseBreakpoint` - Defines the base breakpoint of this component. (default is `xs`), Possible values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
* `baseSize` - Defines the default column size of the grid. (default is `12`), Possible values: 2, 4, 6, 8, 10, 12
* `gap` - Sets the spacing between all columns and rows. (default is `1rem`)
* `columnGap` - Sets the spacing between all columns. (default is the value of the `gap` option)
* `rowGap` - Sets the spacing between all rows. (default is the value of the `gap` option)
* `breakpointGaps` - Defines the base gap for every breakpoint, Possible values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 'mobile', 'tablet', 'desktop'
* `autoRows` - Whether to use the grid-auto-rows feature. (default is `false`)
* `breakpoints` - Key-Value object with name of breakpoint as key and minWidth as number
