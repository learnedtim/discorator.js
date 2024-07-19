---
sidebar_position: 1
---
<Highlight2 color="#86f37f">class</Highlight2>  <Italic>extends [Node:Events](https://example.com)</Italic>
# Client
export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '30px',
      borderStyle: 'solid',
      borderWidth: '1.5px',
      borderColor: '#86f37f',
      color: '#fff',
      padding: '0.2rem',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      paddingTop: '0.1rem',
    }}>
    {children}
  </span>
);
export const Highlight2 = ({children, color}) => (
  <span
    style={{
      color: color,
      fontWeight: 600,
      marginRight: '5px',
    }}>
    {children}
  </span>
)
export const Italic = ({children}) => (
  <span
    style={{
      color: '#77777D',
      fontStyle: 'italic',
    }}>
    {children}
  </span>
)
export const Separator = () => (
  <span
    style={{
      display: 'block',
      backgroundColor: '#222222',
      borderColor: '#222222',
      marginTop: '0.5em',
      marginBottom: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderStyle: 'solid',
      borderWidth: '1.5px',
  }} />
)
export const BlockHighlight = ({children}) => (
  <span
    style={{
      backgroundColor: '#131314',
      borderStyle: 'solid',
      borderColor: '#222222',
      borderWidth: '1px',
      borderRadius: '10px',
      padding: '5px',
      paddingLeft: '10px',
      paddingRight: '10px',
      marginBottom: '15px',
      display: 'inline-block',

    }}>
    {children}
  </span>
)

The main class you'll be using. 
## Summary
<Separator />
<div>
  <div style={{ width: '50%', float: 'left', clear: 'left' }}>

  ### Methods
  * addEventListener
  * construct

  </div>
  <div style={{ width: '50%', float: 'right', clear: 'right' }}>

  ### Props
  * token

  </div>  
</div>  
⠀

## Methods
<Separator />
### constructor(name: String): this
This object's constructor.
#### Arguments
| Argument | Type | Description |
| ---  | --- | --- |
| name | String | Your key to success |
#### Returns
<BlockHighlight>[*this*](https://example.com)</BlockHighlight>
#### Example
```js
const client = new Client('tim')
```
<Separator />
<Highlight2 color="#F83E3E">deprecated</Highlight2>
### ~~addEventListener(name: boolean, arg2: string): boolean~~
A small utility to listen for events that happen inside the Client.
#### Arguments
| Argument | Type | Description |
| ---  | --- | --- |
| name | Boolean | A very simple property you can change however you wish. It is a very special property that, when changed, will give you exactly 1 zimbabwe dollar. |
| arg2 | String | property |
#### Returns
<BlockHighlight>Boolean</BlockHighlight>
#### Example
```js
console.log('hi')
```
## Properties
<Separator />
<Highlight2 color="#ecbc3d">private</Highlight2>
### token: String
Your token stored as a string.

## Example
<Separator />
```js
console.log('hi')
```