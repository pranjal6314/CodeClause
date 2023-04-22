const form = document.querySelector("form");
const usernameInput = document.querySelector("#username");
const print = document.querySelector("#print");
const profileContainer = document.querySelector("#profile");
const reposContainer = document.querySelector("#repos");
const downloadBtn = document.querySelector("#downloadBtn");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  if (username.length === 0) {
    alert("Please enter a username");
    return;
  }
  loadProfile(username);
  loadRepos(username);
});

async function loadProfile(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (response.ok) {
    const userData = await response.json();
    console.log("userData", userData);
    profileContainer.innerHTML = `
        <div class="profile">
          <img src="${userData.avatar_url}" alt="${userData.login}">
          <div>
            <h2>${userData.name}</h2>
            <p>${userData.bio}</p>
            <p><strong>Followers:</strong> ${userData.followers}</p>
            <p><strong>Followings:</strong> ${userData.following}</p>
            <p><strong>Public Repos:</strong> ${userData.public_repos}</p>
            <p><strong>Email :</strong> ${userData.email}</p>

          </div>
        </div>
      `;
  } else {
    alert("Error loading profile");
  }
}

async function loadRepos(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?page=1&per_page=6&sort=updated`
  );
  if (response.ok) {
    const reposData = await response.json();
    let reposHtml = "";
    for (const repo of reposData) {
      reposHtml += `
        <div class="repo">
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available"}</p>
          <ul>
            <li><strong>Size:</strong> ${repo.size} KB</li>
            <li><strong>Language:</strong> ${
              repo.language || "Not specified"
            }</li>
            <li><strong>Forks:</strong> ${repo.forks_count}</li>
            <li><strong>Last updated:</strong> ${new Date(
              repo.pushed_at
            ).toLocaleDateString()}</li>
          </ul>
          <a href="${
            repo.html_url
          }" target="_blank" class="button">Go to repository</a>
        </div>
      `;
    }
    reposContainer.innerHTML = `<h2>Latest repositories</h2><div class="repo-list">${reposHtml}</div>`;
  } else {
    alert("Error loading repositories");
  }
}

downloadBtn.onclick = () => {
  // Increase the height of the profile container to include all content
  profileContainer.style.height = "auto";
  // Generate a PNG version of the profile
  html2canvas(print).then((canvas) => {
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "profile.png";
    downloadLink.click();
  });
};
