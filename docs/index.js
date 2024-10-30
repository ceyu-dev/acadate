async function initializeAndroidDownload() {
  const githubReleases = await fetch(
    "https://api.github.com/repos/ceyu-dev/acadate/releases"
  );

  githubReleases.json().then((releaseInfo) => {
    const androidDownload = document.getElementById("download-android");
    const androidVersion = document.getElementById("version-android");
    androidDownload.setAttribute(
      "href",
      releaseInfo[0].assets[0].browser_download_url
    );
    androidVersion.textContent = `${releaseInfo[0].tag_name}`;
  });
}

initializeAndroidDownload();
