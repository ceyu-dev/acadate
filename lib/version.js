async function getLatestUpdate() {
  const releases = await fetch(
    "https://api.github.com/repos/ceyu-dev/acadate/releases"
  );
  const releasesJson = await releases.json();
  return releasesJson[0];
}

export { getLatestUpdate };
