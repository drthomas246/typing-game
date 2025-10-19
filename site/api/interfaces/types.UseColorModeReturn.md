# Interface: UseColorModeReturn

[types](../modules/types.md).UseColorModeReturn

カスタム`useColorMode`フックの戻り値インターフェース。

## Table of contents

### Properties

- [colorMode](./types.UseColorModeReturn.md#colormode)
- [setColorMode](./types.UseColorModeReturn.md#setcolormode)
- [toggleColorMode](./types.UseColorModeReturn.md#togglecolormode)

## Properties

### colorMode

 **colorMode**: [`ColorMode`](../types/types.ColorMode.md)

現在のカラーモード。

___

### setColorMode

 **setColorMode**: (`colorMode`: [`ColorMode`](../types/types.ColorMode.md)) => `void`

#### Type declaration

(`colorMode`): `void`

カラーモードを設定する関数。

##### Parameters

| Name | Type |
| :------ | :------ |
| `colorMode` | [`ColorMode`](../types/types.ColorMode.md) |

##### Returns

`void`

___

### toggleColorMode

 **toggleColorMode**: () => `void`

#### Type declaration

(): `void`

カラーモードを切り替える関数。

##### Returns

`void`
