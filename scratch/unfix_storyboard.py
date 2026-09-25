import sys

file_path = "/Users/danielgoodwyn/src/BabyNames/iOS-Baby-Names/Baby Names/Base.lproj/Main.storyboard"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace('translatesAutoresizingMaskIntoConstraints="YES"', 'translatesAutoresizingMaskIntoConstraints="NO"')

with open(file_path, "w") as f:
    f.write(content)
print("Storyboard un-updated successfully.")
