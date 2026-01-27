"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console = require("node:console");
const { readFileSync } = require("node:fs");
const { closeSync } = require("node:fs");
const { openSync } = require("node:fs");
const { writeFileSync } = require("node:fs");
const Image = require("./image");
const Color = require("./color");
const args = process.argv.slice(2);
if (args.length < 3) {
    usage();
    process.exit(1);
}
if (args[0] === undefined || args[1] === undefined || args[2] === undefined) {
    usage();
    process.exit(1);
}
const originalImagePath = args[0];
const editedImagePath = args[1];
const editType = args[2];
let image = read(originalImagePath);
switch (editType) {
    case "motionblur":
        checkArgsLength(4);
        if (args[3] === undefined) {
            usage();
            process.exit(1);
        }
        else {
            const motionBlurLength = parseInt(args[3]);
            informativeMessage(editType, originalImagePath, editedImagePath);
            //Call motionBlur function here with motionBlurLength
            motionBlur(image, motionBlurLength);
        }
        break;
    case "grayscale":
        checkArgsLength(3);
        informativeMessage(editType, originalImagePath, editedImagePath);
        //Call grayscale function here
        grayscale(image);
        break;
    case "invert":
        checkArgsLength(3);
        informativeMessage(editType, originalImagePath, editedImagePath);
        //Call invert function here
        invert(image);
        break;
    case "emboss":
        checkArgsLength(3);
        informativeMessage(editType, originalImagePath, editedImagePath);
        //Call emboss function here
        emboss(image);
        break;
    // No additional parameters needed
    default:
        usage();
        process.exit(1);
}
write(image, editedImagePath);
function usage() {
    console.log("Usage: npm run start <originalImagePath> <editedImagePath> <grayscale|invert|emboss|motionblur> {motion-blur-length}");
}
function checkArgsLength(expectedLength) {
    if (args.length !== expectedLength) {
        usage();
        process.exit(1);
    }
}
function informativeMessage(editType, originalImagePath, editedImagePath) {
    console.log(`Applying ${editType} to image at ${originalImagePath} and saving to ${editedImagePath}`);
}
function read(filePath) {
    const file = readFileSync(filePath, "utf-8");
    const lines = file.split(" ");
    // console.log(`lines:\n${lines}`);
    //Skip p3
    //parse width and height
    const width = parseInt(lines[1]);
    const height = parseInt(lines[2]);
    const image = new Image(width, height);
    //skip max color value
    //Parse pixel data
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = new Color(0, 0, 0);
            color.red = parseInt(lines[4 + x * 3 + y * width * 3]);
            color.green = parseInt(lines[5 + x * 3 + y * width * 3]);
            color.blue = parseInt(lines[6 + x * 3 + y * width * 3]);
            //Set pixel at (x, y) to Color(red, green, blue)
            image.setPixel(x, y, color);
        }
    }
    //Return a new image object
    return image;
}
function write(image, filePath) {
    let fileContent = "P3\r\n";
    fileContent += `${image.width} ${image.height}\r\n`;
    fileContent += `255\r\n`;
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const color = image.getPixel(x, y);
            const buffer = x === 0 ? "" : " ";
            fileContent += buffer;
            fileContent += `${color.red} ${color.green} ${color.blue}`;
        }
        fileContent += `\r\n`;
    }
    // console.log(`fileContent:\n${fileContent}`);
    const fd = openSync(filePath, "w");
    writeFileSync(fd, fileContent);
    closeSync(fd);
}
function invert(image) {
    for (let x = 0; x < image.getWidth(); x++) {
        for (let y = 0; y < image.getHeight(); y++) {
            const currentColor = image.getPixel(x, y);
            currentColor.red = 255 - currentColor.red;
            currentColor.green = 255 - currentColor.green;
            currentColor.blue = 255 - currentColor.blue;
        }
    }
}
function grayscale(image) {
    for (let x = 0; x < image.getWidth(); x++) {
        for (let y = 0; y < image.getHeight(); y++) {
            const currentColor = image.getPixel(x, y);
            let avg = (currentColor.red + currentColor.green + currentColor.blue) / 3;
            let grayLevel = Math.floor(avg);
            grayLevel = Math.max(0, Math.min(255, grayLevel));
            currentColor.red = grayLevel;
            currentColor.green = grayLevel;
            currentColor.blue = grayLevel;
        }
    }
}
function emboss(image) {
    for (let x = image.getWidth() - 1; x >= 0; x--) {
        for (let y = image.getHeight() - 1; y >= 0; y--) {
            const currentColor = image.getPixel(x, y);
            let diff = 0;
            if (x > 0 && y > 0) {
                const upperLeftColor = image.getPixel(x - 1, y - 1);
                if (Math.abs(currentColor.red - upperLeftColor.red) > Math.abs(diff)) {
                    diff = currentColor.red - upperLeftColor.red;
                }
                if (Math.abs(currentColor.green - upperLeftColor.green) > Math.abs(diff)) {
                    diff = currentColor.green - upperLeftColor.green;
                }
                if (Math.abs(currentColor.blue - upperLeftColor.blue) > Math.abs(diff)) {
                    diff = currentColor.blue - upperLeftColor.blue;
                }
            }
            let grayLevel = 128 + diff;
            grayLevel = Math.max(0, Math.min(grayLevel, 255));
            currentColor.red = grayLevel;
            currentColor.green = grayLevel;
            currentColor.blue = grayLevel;
        }
    }
}
function motionBlur(image, length) {
    if (length <= 0) {
        return;
    }
    for (let x = 0; x < image.getWidth(); x++) {
        for (let y = 0; y < image.getHeight(); y++) {
            const currentColor = image.getPixel(x, y);
            const maxX = Math.min(image.getWidth() - 1, x + length - 1);
            for (let i = x + 1; i <= maxX; i++) {
                const blurColor = image.getPixel(i, y);
                currentColor.red += blurColor.red;
                currentColor.green += blurColor.green;
                currentColor.blue += blurColor.blue;
            }
            const delta = maxX - x + 1;
            currentColor.red = Math.floor(currentColor.red / delta);
            currentColor.green = Math.floor(currentColor.green / delta);
            currentColor.blue = Math.floor(currentColor.blue / delta);
        }
    }
}
//# sourceMappingURL=imageEditor.js.map