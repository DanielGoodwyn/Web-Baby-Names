import urllib.request
import json
import time

PROJECT_ID = "goodwyn-babynames"
URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/Name"

# Read yob2013.txt
boys = []
girls = []

with open("assets/yob2013.txt", "r") as f:
    for line in f:
        line = line.strip()
        if not line: continue
        parts = line.split(",")
        name = parts[0]
        gender = parts[1]
        if gender == "F" and len(girls) < 500:
            girls.append(name)
        elif gender == "M" and len(boys) < 500:
            boys.append(name)
            
print(f"Loaded {len(girls)} girls and {len(boys)} boys.")

def upload_name(name, gender):
    data = {
        "fields": {
            "name": {"stringValue": name},
            "gender": {"stringValue": gender}
        }
    }
    req = urllib.request.Request(URL, method="POST", data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            return response.status
    except Exception as e:
        print(f"Error uploading {name}: {e}")
        return 0

for i, g in enumerate(girls):
    upload_name(g, "F")
    if i % 100 == 0:
        print(f"Uploaded {i} girls...")

for i, b in enumerate(boys):
    upload_name(b, "M")
    if i % 100 == 0:
        print(f"Uploaded {i} boys...")

print("Done!")
