import console = require("node:console");
const {readFileSync} = require("node:fs");
const {closeSync} = require("node:fs");
const {openSync} = require("node:fs");
const {writeFileSync} = require("node:fs");
import Image = require("./image");
import Color = require("./color");

const args : string[] = process.argv.slice(2);

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

let image:Image = read(originalImagePath);

switch (editType) {
    case "motionblur":
      checkArgsLength(4);
      if (args[3] === undefined) {
          usage();
          process.exit(1);
      } else {
          const motionBlurLength = parseInt(args[3]);
          informativeMessage(editType, originalImagePath, editedImagePath);
          //Call motionBlur function here with motionBlurLength
      }
      break;
    case "grayscale":
      checkArgsLength(3);
      informativeMessage(editType, originalImagePath, editedImagePath);
      //Call grayscale function here
      break;
    case "invert":
      checkArgsLength(3);
      informativeMessage(editType, originalImagePath, editedImagePath);
      //Call invert function here
      write(editedImagePath, image);
      break;
    case "emboss":
      checkArgsLength(3);
      informativeMessage(editType, originalImagePath, editedImagePath);
      //Call emboss function here
      break;
      // No additional parameters needed
    default:
      usage();
      process.exit(1);
}


function usage(){
    console.log("Usage: npm run start <originalImagePath> <editedImagePath> <grayscale|invert|emboss|motionblur> {motion-blur-length}");
}

function checkArgsLength(expectedLength: number){
    if (args.length !== expectedLength) {
        usage();
        process.exit(1);
    }
}

function informativeMessage(editType: string, originalImagePath: string, editedImagePath: string){
    console.log(`Applying ${editType} to image at ${originalImagePath} and saving to ${editedImagePath}`);
}

function read(filePath: string): Image {
    const file = readFileSync(filePath, 'utf-8');
    const lines = file.split(' ');

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
            color.red = lines[4 + (x * 3) + (y * width * 3)];
            color.green = lines[5 + (x * 3) + (y * width * 3)]; 
            color.blue = lines[6 + (x * 3) + (y * width * 3) ];
            //Set pixel at (x, y) to Color(red, green, blue)
            image.setPixel(x, y, color);
        }
    }

    //Return a new image object
    return image;
}

function write(filePath: string, image: Image){
    let fileContent = "P3\n";
    fileContent += `${image.width} ${image.height}\n`;
    fileContent += `255\n`;
    
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const color = image.getPixel(x, y);
            const buffer = (x === 0) ? '' : ' ';
            fileContent += buffer;
            fileContent += `${color.red} ${color.green} ${color.blue}`;
        }
        fileContent += `\n`;
    }

    // console.log(`fileContent:\n${fileContent}`);

    const fd = openSync(filePath, 'w');
    writeFileSync(fd, fileContent);
    closeSync(fd);
}


function invert(){}
function grayscale(){}
function emboss(){}
function motionBlur(length: number){}