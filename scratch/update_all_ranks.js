const fs = require("fs");
const https = require("https");

const csv = fs.readFileSync("assets/yob2013.csv", "utf-8");
const regex = /(\d{4}),([A-Za-z]+),([MF])/g;
let match;
const map = {};
while ((match = regex.exec(csv)) !== null) {
  map[match[2] + "_" + match[3]] = parseInt(match[1], 10);
}

function fetchDocs(pageToken = "") {
  return new Promise((resolve, reject) => {
    let url = "https://firestore.googleapis.com/v1/projects/goodwyn-babynames/databases/(default)/documents/Name?pageSize=300" + (pageToken ? "&pageToken=" + pageToken : "");
    https.get(url, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve(JSON.parse(data)));
      res.on("error", reject);
    });
  });
}

function patchDoc(docPath, rank) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      fields: {
        rank: { integerValue: rank }
      }
    });
    const options = {
      hostname: "firestore.googleapis.com",
      path: "/v1/" + docPath + "?updateMask.fieldPaths=rank",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      }
    };
    const req = https.request(options, res => {
      let body = "";
      res.on("data", c => body += c);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error("Status " + res.statusCode + ": " + body));
        }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("Fetching all documents...");
  let allDocs = [];
  let token = "";
  do {
    let res = await fetchDocs(token);
    allDocs = allDocs.concat(res.documents || []);
    token = res.nextPageToken || "";
  } while (token);
  
  console.log("Total documents fetched:", allDocs.length);
  
  const CONCURRENCY = 20;
  let index = 0;
  let successCount = 0;
  let errorCount = 0;
  
  async function worker() {
    while (index < allDocs.length) {
      const doc = allDocs[index++];
      const name = doc.fields.name.stringValue;
      const gender = doc.fields.gender.stringValue;
      const rank = map[name + "_" + gender];
      if (!rank) {
        console.error("No rank for", name, gender);
        errorCount++;
        continue;
      }
      try {
        await patchDoc(doc.name, rank);
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Updated ${successCount} / ${allDocs.length} names...`);
        }
      } catch (err) {
        console.error(`Failed ${name} (${doc.name}):`, err.message);
        errorCount++;
      }
    }
  }
  
  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  console.log(`Finished! Successfully updated: ${successCount}, Errors: ${errorCount}`);
}

run().catch(console.error);
