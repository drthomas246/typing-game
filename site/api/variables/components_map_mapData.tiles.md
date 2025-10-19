# Variable: tiles

[components/map/mapData](../modules/components_map_mapData.md).tiles

 `Const` **tiles**: `ReadonlyArray`\<[`Tile`](../types/types.Tile.md)\>

マップを構成するタイル情報の配列。
各オブジェクトは、タイルの画像ソース、ワールド座標(x, y)、および寸法(w, h)を定義します。
座標は、タイルのグリッド位置とタイルの固定寸法に基づいて計算されます。
`as const`アサーションにより、この配列とその内容が読み取り専用として扱われることが保証されます。
