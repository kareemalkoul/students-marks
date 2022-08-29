import * as fs from 'fs';
import * as path from 'path';
import { saveMark, insertAndCheck } from './mongo.js';
import pkg from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pkg;
import { extractMarksFromDocument } from 'ourmarks';
import { fileURLToPath } from 'node:url';
// Fix __dirname not defined
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// pdf files
let pdfFilesName;
pdfFilesName = fs.readdirSync('./marks/');
console.debug(pdfFilesName);
async function pdf2json(fileName) {
    const TARGET_DOCUMENT = path.resolve(__dirname, `./marks/${fileName}`);
    const documentData = fs.readFileSync(TARGET_DOCUMENT);
    const document = await getDocument(documentData).promise;
    const marksRecords = await extractMarksFromDocument(document);
    document.destroy();
    var json = JSON.stringify(marksRecords);
    fs.writeFileSync(`./jsons/${fileName.split('.')[0]}.json`, json, 'utf8');
}
await Promise.all(pdfFilesName.map(async (element) => { await pdf2json(element); }));
console.debug("pdf2json Done");
let jsonFilesName;
jsonFilesName = fs.readdirSync('./jsons/');
const jsonFiles = [];
console.debug(jsonFilesName);
let allMarks = [];
async function readjson(fileName) {
    const TARGET_DOCUMENT = path.resolve(__dirname, `./jsons/${fileName}`);
    const jsonFile = fs.readFileSync(TARGET_DOCUMENT);
    return JSON.parse(jsonFile.toString());
}
async function insertData(files, name) {
    files.forEach(async (student) => {
        let std = {
            "_id": student.studentId,
            "Name": student.studentName,
        };
        // let mark: any = { "hbd": student.examMark }
        std[`${name}`] = student.examMark;
        // console.debug(JSON.stringify(std));
        try {
            await saveMark(std);
        }
        catch (err) {
        }
        await insertAndCheck(student.studentId, std);
        //    await update(student.studentId, mark);
    });
}
// const kk = await readjson(jsonFilesName[0])
// console.debug(kk);
async function inseForAllMarks(filesName) {
    for (let i = 0; i < filesName.length; i++) {
        let file = await readjson(filesName[i]);
        let name = filesName[i].split(".")[0];
        insertData(file, name);
    }
    // filesName.forEach(async File => {
    //     let file = await readjson(File);
    //     let name = File.split(".")[0];
    //     insertData(file, name);
    // });
}
// await insertData(await readjson(jsonFilesName[0]), jsonFilesName[0].split(".")[0]);
// await insertData(await readjson(jsonFilesName[1]), jsonFilesName[1].split(".")[0]);
await inseForAllMarks(jsonFilesName);
// allMarks.forEach(element => {
//     saveMark({ StudentID: element.studentId, })
// });
