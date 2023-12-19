const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

class SpriteGenerator {
    constructor() {
        this.images = [];
        this.imageNames = [];
    }

    async loadImagesFromFolder(folderPath) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            if (/\.(jpe?g|png|gif|bmp)$/i.test(file)) {
                const imagePath = path.join(folderPath, file);
                const image = await loadImage(imagePath);
                this.images.push(image);
                this.imageNames.push(path.basename(file, path.extname(file)));
            }
        }
    }

    calculateNumberCols(numCols) {
        return numCols || Math.ceil(Math.sqrt(this.images.length));
    }

    createSpriteSheet(cols = 1, padding = 0) {
        if (this.images.length === 0) return null;

        const totalImages = this.images.length;
        const spriteHeight =
            Math.ceil(totalImages / cols) * this.images[0].height +
            (Math.ceil(totalImages / cols) - 1) * padding;
        const spriteWidth = cols * this.images[0].width + (cols - 1) * padding;

        const canvas = createCanvas(spriteWidth, spriteHeight);
        const ctx = canvas.getContext("2d");

        let x = 0;
        let y = 0;
        for (const image of this.images) {
            ctx.drawImage(image, x, y);
            x += image.width + padding;
            if (x + image.width > spriteWidth) {
                x = 0;
                y += image.height + padding;
            }
        }

        return canvas.toBuffer();
    }

    generateCSS(mainClassName, spriteFileName, cols = 1, padding = 0) {
        if (this.images.length === 0) return "";

        let cssStyles = `
.${mainClassName} {
    background-image: url('${spriteFileName}');
    background-repeat: no-repeat;
    display: inline-block;
}
`;
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.images.length; i++) {
            const image = this.images[i];
            cssStyles += `
.${mainClassName}.${this.imageNames[i]} {
    background-position: ${-x}px ${-y}px;
    width: ${image.width}px;
    height: ${image.height}px;
}
`;
            x += image.width + padding;
            if (x + image.width > cols * image.width) {
                x = 0;
                y += image.height + padding;
            }
        }

        return cssStyles;
    }
}

function parseCommandLineArguments() {
    const args = process.argv.slice(2);
    const options = {
        inputFolder: ".",
        spriteOutput: "sprite-sheet.png",
        cssOutput: "sprite.css",
        cssMainClass: "sprite",
        numCols: 0,
        padding: 0,
    };

    args.forEach((arg) => {
        if (arg.startsWith("--inputFolder=")) {
            options.inputFolder = arg.split("=")[1];
        } else if (arg.startsWith("--spriteOutput=")) {
            const spriteOutputArg = arg.split("=")[1];
            options.spriteOutput = spriteOutputArg.endsWith(".png")
                ? spriteOutputArg
                : spriteOutputArg + ".png";
        } else if (arg.startsWith("--cssOutput=")) {
            const cssOutputArg = arg.split("=")[1];
            options.cssOutput = cssOutputArg.endsWith(".css")
                ? cssOutputArg
                : cssOutputArg + ".css";
        } else if (arg.startsWith("--cssMainClass=")) {
            options.cssMainClass = arg.split("=")[1];
        } else if (arg.startsWith("--numCols=")) {
            options.numCols = parseInt(arg.split("=")[1]);
        } else if (arg.startsWith("--padding=")) {
            options.padding = parseInt(arg.split("=")[1]);
        }
    });

    return options;
}

const { inputFolder, spriteOutput, cssOutput, cssMainClass, numCols, padding } =
    parseCommandLineArguments();

(async () => {
    const spriteGenerator = new SpriteGenerator();
    await spriteGenerator.loadImagesFromFolder(inputFolder);
    const numberCols = spriteGenerator.calculateNumberCols(numCols);
    const spriteBuffer = spriteGenerator.createSpriteSheet(numberCols, padding);
    const cssCode = spriteGenerator.generateCSS(
        cssMainClass,
        spriteOutput.replace(/^.*[\\/]/, ""),
        numberCols,
        padding
    );

    fs.writeFileSync(spriteOutput, spriteBuffer);
    fs.writeFileSync(cssOutput, cssCode);
})();
