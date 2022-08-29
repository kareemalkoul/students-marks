import console from "console";
import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/Marks2")
    .then(() => console.debug("Connected to DataBase..."))
    .catch((err) => console.debug(err));
const MarkStudent = new mongoose.Schema({
    _id: { type: Number },
    Name: { type: String, required: true },
}, { strict: false });
MarkStudent.virtual('StudentID').get(function () {
    return this._id;
});
const MarksStudents = mongoose.model("MarksStudents", MarkStudent);
// const marksStudent = new MarksStudents({
//     _id: 1,
//     Name: "kareem"
// })
// const result = await marksStudent.save();
async function saveMark(query) {
    const marksStudent = new MarksStudents(query);
    const result = await marksStudent.save();
}
async function UpdateMark(query) {
    MarksStudents.find();
    const marksStudent = new MarksStudents(query);
    const result = await marksStudent.save();
    console.debug(result);
}
async function getAllMarks() {
    const Marks = await MarksStudents.find();
    console.debug(Marks);
}
async function getMarkByID(id) {
    const Mark = await MarksStudents.findById(id);
    console.debug(Mark);
}
async function insertAndCheck(id, query) {
    let result = await MarksStudents.findById(id);
    if (result) {
        await MarksStudents.updateOne({ _id: id }, { $set: query });
    }
    else {
        const marksStudent = new MarksStudents(query);
        result = await marksStudent.save();
    }
}
const result = await getMarkByID(1);
export { saveMark, getAllMarks, UpdateMark, getMarkByID, insertAndCheck };
// $addToSet:
