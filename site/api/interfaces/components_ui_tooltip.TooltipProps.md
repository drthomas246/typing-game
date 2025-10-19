# Interface: TooltipProps

[components/ui/tooltip](../modules/components_ui_tooltip.md).TooltipProps

## Hierarchy

- `TooltipRootProps`

  ↳ **`TooltipProps`**

## Table of contents

### Properties

- [aria-label](./components_ui_tooltip.TooltipProps.md#aria-label)
- [children](./components_ui_tooltip.TooltipProps.md#children)
- [closeDelay](./components_ui_tooltip.TooltipProps.md#closedelay)
- [closeOnClick](./components_ui_tooltip.TooltipProps.md#closeonclick)
- [closeOnEscape](./components_ui_tooltip.TooltipProps.md#closeonescape)
- [closeOnPointerDown](./components_ui_tooltip.TooltipProps.md#closeonpointerdown)
- [closeOnScroll](./components_ui_tooltip.TooltipProps.md#closeonscroll)
- [content](./components_ui_tooltip.TooltipProps.md#content)
- [contentProps](./components_ui_tooltip.TooltipProps.md#contentprops)
- [defaultOpen](./components_ui_tooltip.TooltipProps.md#defaultopen)
- [disabled](./components_ui_tooltip.TooltipProps.md#disabled)
- [id](./components_ui_tooltip.TooltipProps.md#id)
- [ids](./components_ui_tooltip.TooltipProps.md#ids)
- [immediate](./components_ui_tooltip.TooltipProps.md#immediate)
- [interactive](./components_ui_tooltip.TooltipProps.md#interactive)
- [lazyMount](./components_ui_tooltip.TooltipProps.md#lazymount)
- [onExitComplete](./components_ui_tooltip.TooltipProps.md#onexitcomplete)
- [onOpenChange](./components_ui_tooltip.TooltipProps.md#onopenchange)
- [open](./components_ui_tooltip.TooltipProps.md#open)
- [openDelay](./components_ui_tooltip.TooltipProps.md#opendelay)
- [portalRef](./components_ui_tooltip.TooltipProps.md#portalref)
- [portalled](./components_ui_tooltip.TooltipProps.md#portalled)
- [positioning](./components_ui_tooltip.TooltipProps.md#positioning)
- [present](./components_ui_tooltip.TooltipProps.md#present)
- [recipe](./components_ui_tooltip.TooltipProps.md#recipe)
- [showArrow](./components_ui_tooltip.TooltipProps.md#showarrow)
- [skipAnimationOnMount](./components_ui_tooltip.TooltipProps.md#skipanimationonmount)
- [unmountOnExit](./components_ui_tooltip.TooltipProps.md#unmountonexit)
- [unstyled](./components_ui_tooltip.TooltipProps.md#unstyled)

## Properties

### aria-label

 `Optional` **aria-label**: `string`

Custom label for the tooltip.

#### Inherited from

ChakraTooltip.RootProps.aria-label

___

### children

 `Optional` **children**: `ReactNode`

#### Inherited from

ChakraTooltip.RootProps.children

___

### closeDelay

 `Optional` **closeDelay**: `number`

The close delay of the tooltip.

**`Default`**

```ts
150
```

#### Inherited from

ChakraTooltip.RootProps.closeDelay

___

### closeOnClick

 `Optional` **closeOnClick**: `boolean`

Whether the tooltip should close on click

**`Default`**

```ts
true
```

#### Inherited from

ChakraTooltip.RootProps.closeOnClick

___

### closeOnEscape

 `Optional` **closeOnEscape**: `boolean`

Whether to close the tooltip when the Escape key is pressed.

**`Default`**

```ts
true
```

#### Inherited from

ChakraTooltip.RootProps.closeOnEscape

___

### closeOnPointerDown

 `Optional` **closeOnPointerDown**: `boolean`

Whether to close the tooltip on pointerdown.

**`Default`**

```ts
true
```

#### Inherited from

ChakraTooltip.RootProps.closeOnPointerDown

___

### closeOnScroll

 `Optional` **closeOnScroll**: `boolean`

Whether the tooltip should close on scroll

**`Default`**

```ts
true
```

#### Inherited from

ChakraTooltip.RootProps.closeOnScroll

___

### content

 **content**: `ReactNode`

ツールチップ内に表示される主要なコンテンツです。

___

### contentProps

 `Optional` **contentProps**: `TooltipContentProps`

ツールチップのコンテンツコンポーネントに直接渡されるプロパティです。

___

### defaultOpen

 `Optional` **defaultOpen**: `boolean`

The initial open state of the tooltip when rendered.
Use when you don't need to control the open state of the tooltip.

#### Inherited from

ChakraTooltip.RootProps.defaultOpen

___

### disabled

 `Optional` **disabled**: `boolean`

ツールチップ機能を無効にするかどうかを決定します。
`true`の場合、ツールチップは表示されず、その子要素が直接レンダリングされます。

#### Overrides

ChakraTooltip.RootProps.disabled

___

### id

 `Optional` **id**: `string`

The unique identifier of the machine.

#### Inherited from

ChakraTooltip.RootProps.id

___

### ids

 `Optional` **ids**: `Partial`\<\{ `arrow`: `string` ; `content`: `string` ; `positioner`: `string` ; `trigger`: `string`  }\>

The ids of the elements in the tooltip. Useful for composition.

#### Inherited from

ChakraTooltip.RootProps.ids

___

### immediate

 `Optional` **immediate**: `boolean`

Whether to synchronize the present change immediately or defer it to the next frame

#### Inherited from

ChakraTooltip.RootProps.immediate

___

### interactive

 `Optional` **interactive**: `boolean`

Whether the tooltip's content is interactive.
In this mode, the tooltip will remain open when user hovers over the content.

**`See`**

https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus

**`Default`**

```ts
false
```

#### Inherited from

ChakraTooltip.RootProps.interactive

___

### lazyMount

 `Optional` **lazyMount**: `boolean`

Whether to enable lazy mounting

**`Default`**

```ts
false
```

#### Inherited from

ChakraTooltip.RootProps.lazyMount

___

### onExitComplete

 `Optional` **onExitComplete**: `VoidFunction`

Function called when the animation ends in the closed state

#### Inherited from

ChakraTooltip.RootProps.onExitComplete

___

### onOpenChange

 `Optional` **onOpenChange**: (`details`: `OpenChangeDetails`) => `void`

#### Type declaration

(`details`): `void`

Function called when the tooltip is opened.

##### Parameters

| Name | Type |
| :------ | :------ |
| `details` | `OpenChangeDetails` |

##### Returns

`void`

#### Inherited from

ChakraTooltip.RootProps.onOpenChange

___

### open

 `Optional` **open**: `boolean`

The controlled open state of the tooltip

#### Inherited from

ChakraTooltip.RootProps.open

___

### openDelay

 `Optional` **openDelay**: `number`

The open delay of the tooltip.

**`Default`**

```ts
400
```

#### Inherited from

ChakraTooltip.RootProps.openDelay

___

### portalRef

 `Optional` **portalRef**: `RefObject`\<`HTMLElement`\>

Portalのコンテナとして使用するHTMLElementへの参照です。

___

### portalled

 `Optional` **portalled**: `boolean`

ツールチップのコンテンツをReact Portalを使用してレンダリングするかどうかを決定します。
デフォルトは`true`です。

___

### positioning

 `Optional` **positioning**: `PositioningOptions`

The user provided options used to position the popover content

#### Inherited from

ChakraTooltip.RootProps.positioning

___

### present

 `Optional` **present**: `boolean`

Whether the node is present (controlled by the user)

#### Inherited from

ChakraTooltip.RootProps.present

___

### recipe

 `Optional` **recipe**: `SlotRecipeDefinition`\<`string`, `SlotRecipeVariantRecord`\<`string`\>\>

#### Inherited from

ChakraTooltip.RootProps.recipe

___

### showArrow

 `Optional` **showArrow**: `boolean`

ツールチップの矢印を表示するかどうかを決定します。

___

### skipAnimationOnMount

 `Optional` **skipAnimationOnMount**: `boolean`

Whether to allow the initial presence animation.

**`Default`**

```ts
false
```

#### Inherited from

ChakraTooltip.RootProps.skipAnimationOnMount

___

### unmountOnExit

 `Optional` **unmountOnExit**: `boolean`

Whether to unmount on exit.

**`Default`**

```ts
false
```

#### Inherited from

ChakraTooltip.RootProps.unmountOnExit

___

### unstyled

 `Optional` **unstyled**: `boolean`

If `true`, the element will opt out of the theme styles.

#### Inherited from

ChakraTooltip.RootProps.unstyled
