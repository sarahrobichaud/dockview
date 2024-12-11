const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const showcaseDir = path.resolve(__dirname, "..", "harborvault");

function cloneSourceForVersion(project, version, sourceUrl) {
  const projectDir = path.join(showcaseDir, project, version);
  const sourceDir = path.join(projectDir, "source");

  if (fs.existsSync(sourceDir)) {
    console.log(`Source already exists for ${project} ${version}. Skipping...`);
    return;
  }

  const [url] = sourceUrl.split("/tree");

  console.log(`Cloning source for ${project} ${version}...`);

  // Clone the source repository into the source directory
  execSync(`git clone --depth 1 --branch ${version} ${url} ${sourceDir}`, {
    stdio: "inherit",
  });
}

function processProjectVersion(project, version) {
  const projectDir = path.join(showcaseDir, project, version);
  const sourceLinkPath = path.join(projectDir, "source-link.txt");

  if (fs.existsSync(sourceLinkPath)) {
    const sourceUrl = fs
      .readFileSync(sourceLinkPath, "utf8")
      .replace("Source code available at:", "")
      .trim();
    cloneSourceForVersion(project, version, sourceUrl);
  } else {
    console.log(`No source link found for ${project} ${version}. Skipping...`);
  }
}

function processAllProjects() {
  const projects = fs
    .readdirSync(showcaseDir)
    .filter((n) => n !== "README.md" && n !== ".git");

  projects.forEach((project) => {
    const versionsDir = path.join(showcaseDir, project);
    const versions = fs.readdirSync(versionsDir);

    versions.forEach((version) => {
      const versionDir = path.join(versionsDir, version);
      if (fs.lstatSync(versionDir).isDirectory()) {
        processProjectVersion(project, version);
      }
    });
  });
}

processAllProjects();
