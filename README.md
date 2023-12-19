# Sprite Generator

Generate sprites from multiple images! CSS export available.
There are two versions of the generator available:
- UI version - Html webpage that includes javascript to generate the sprite.
- JS script version - JS script that will generate sprites based on a folder path (will consider all images inside this folder).

## UI version

![Tool UI](https://i.imgur.com/wnwh5dC.png)

This is a very simple tool, based in HTML and JS.

Included features:

-   Image download;
-   CSS export;
-   Padding;
-   Number columns.

## JS script version

How to run:

```sh
npm i # Install dependencies
node sprite-generator-script.js [--option=option] # Execute
```

Available options:
`--inputFolder` Set folder containing images to be used. It will consider all images inside this folder. Default value: "."
`--spriteOutput` Set path and filename for result sprite. Example: "/home/folder/sprite.png". Default value: "sprite-sheet.png"
`--cssOutput` Set path and filename for result sprite. Example: "/home/folder/css.css". Default value: "sprite.css"
`--cssMainClass` Set css main class name for css generated. Default value: "sprite"
`--numCols` Set number of columns in result sprite. Default value: 0
`--padding` Set amount of padding in result sprite. Default value: 0

---

Feel free to use in any context!

Sources of inspiration:
[Create a CSS sprite generator tool](https://blog.logrocket.com/create-css-sprite-generator-tool/)
