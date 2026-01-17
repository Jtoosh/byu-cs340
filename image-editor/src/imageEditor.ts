import console = require("node:console");
const {readFileSync} = require("node:fs");
const {Image} = require("./image");

type Image = typeof Image;

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

let image:string = read(originalImagePath);

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

function read(filePath: string): string {
    const file = readFileSync(filePath, 'utf-8');
    // console.log(file);
    return "Yes";
}

function invert(){}
function grayscale(){}
function emboss(){}
function motionBlur(length: number){}