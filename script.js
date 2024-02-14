async function getMatchData() {
  // Check if the user is offline
  if (!navigator.onLine) {
    document.getElementById("matches").innerHTML = `
      <div id="offline-message">
        
        <img class="offline-img" src="images/offline.jpg" alt="Offline Image">
      </div>
    `;
    return;
  }

  return await fetch(
    "https://api.cricapi.com/v1/cricScore?apikey=e42574c5-3d8c-42c5-9e09-7c5f527a8fc5"
  )
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success" || !data.data) {
        document.getElementById("matches").textContent =
          "API LIMITS TOUCHED FOR TODAY ☹";
        return;
      }

      const matchesList = data.data;

      // Filter out matches with a status containing "won" or "Match not started"
      const relevantData = matchesList
        .filter(
          (match) =>
            !match.status.includes("won") &&
            match.status !== "Match not started"
        )
        .map((match) => {
          const teamBScore = match.t2s ? match.t2s : "not batted yet";
          const teamAScore = match.t1s ? match.t1s : "not batted yet";

          const matchStatus =
            teamAScore === "not batted yet" && teamBScore === "not batted yet"
              ? "Match Not Started Yet"
              : "Match Going On";

          return `
                <li class="match">
                  <b class="match-status">
                    <strong id="match-status-title">
                      Match Status : 
                    </strong> ${matchStatus}
                  </b>
                  <div class="type-cont">
                    <strong id="type">Match Type : </strong> ${match.matchType.toUpperCase()}<br>
                  </div>
                  <div id="scores">
                    <div class="team-info">
                      <p class="team-name">  <img src="${match.t1img}" alt="${
            match.t1
          }" class="team-flag"> ${match.t1.toUpperCase()} </p><b>${teamAScore}</b>
                    </div>
                    <div class="team-info">
                      <p class="team-name"><img src="${match.t2img}" alt="${
            match.t2
          }" class="team-flag"> ${match.t2.toUpperCase()} </p><b>${teamBScore}</b>
                    </div>
                  </div>
                </li>`;
        });

      console.log({ relevantData });
      document.getElementById("matches").innerHTML = relevantData
        .map((match) => `<li>${match}</li>`)
        .join(" ");
    })
    .catch((e) => console.log(e));
}

getMatchData();
