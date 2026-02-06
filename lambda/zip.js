const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream("function.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
    console.log(`function.zip created, ${archive.pointer()} total bytes`);
});

archive.on("error", (err) => { throw err; });

archive.pipe(output);
archive.directory("dist/", false);
archive.finalize();
