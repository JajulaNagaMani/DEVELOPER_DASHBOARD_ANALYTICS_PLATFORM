const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../FRONTEND_FOLDER_WEB_APPLICATION")));
const custFile = "data.json";
const noteFile = "notifications.json";
function readFile(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf8") || "[]");
}
function writeFile(file, stuff) {
    fs.writeFileSync(file, JSON.stringify(stuff, null, 2), "utf8");
}
app.get("/customers", (req, res) => {
    res.json(readFile(custFile));
});
app.post("/customers", (req, res) => {
    let list = readFile(custFile);
    let newGuy = { id: Date.now(), ...req.body };
    list.push(newGuy);
    writeFile(custFile, list);
    let notes = readFile(noteFile);
    notes.push({
        id: Date.now(),
        message: "Customer " + newGuy.name + " added.",
        time: new Date().toISOString(),
    });
    writeFile(noteFile, notes);

    res.json(newGuy);
});
app.delete("/customers/:id", (req, res) => {
    let list = readFile(custFile);
    let cid = parseInt(req.params.id);
    let gone = list.find(c => c.id === cid);

    list = list.filter(c => c.id !== cid);
    writeFile(custFile, list);

    if (gone) {
        let notes = readFile(noteFile);
        notes.push({
            id: Date.now(),
            message: "Customer " + gone.name + " removed.",
            time: new Date().toISOString(),
        });
        writeFile(noteFile, notes);
    }

    res.json({ ok: true });
});
app.get("/notifications", (req, res) => {
    res.json(readFile(noteFile));
});

app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
    console.log(`Open Login page at: http://localhost:${port}/Login/Login_page.html`);
});
