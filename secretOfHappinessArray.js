const http = require("http");

let database = [];
let slNo = 1;

async function createRow(jsonDataRow) {
    dataRow = JSON.parse(jsonDataRow);
    dataRow.slNo = slNo++;
    dataRow.date = new Date();
    database.push(dataRow);
}

async function focusAreas() {
    let focusAreas = [];
    let lastEntry = database[database.length - 1];
    let areas = Object.keys(lastEntry);
    let values = Object.values(lastEntry);
    for (i = 0; i < areas.length - 2; i++) {
        if (values[i] <= 3) focusAreas.push(areas[i]);
    }
    return focusAreas;
}

const server = http.createServer((req, res) => {
    let splitReq = req.url.split("/");
    let endUrl = splitReq[splitReq.length - 1];
    let idNo = Number(endUrl);
    let data;
    if (req.method == "POST" && endUrl == "create") {
        req.on("data", (chunk) => {
            data = chunk.toString();
        });
        req.on("end", () => {
            createRow(data);
            res.write("Data Updated Successfully");
            res.end();
        });
    }
    if (req.method == "GET" && endUrl == "all") {
        let printArray = JSON.stringify(database);
        res.write(printArray);
        res.end();
    }
    if (req.method == "GET" && endUrl == "focus") {
        (async() => {
            const areasToFocus = await focusAreas();
            const printAreasToFocus = JSON.stringify(areasToFocus);
            if (areasToFocus.length == 0) res.write("You have no areas to focus");
            else res.write(printAreasToFocus);
            res.end();
        })();
    }
});
server.listen(process.env.PORT || 5555, () => {
    const port = server.address().port;
    console.log(`connected to port: ${port}`);
});

console.log("check");