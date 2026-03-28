// error area declaration
let errorArea = document.getElementById("error-area");

// convert JSONResume file input into force-layout links
const convertJson = async function (e) {
  e.preventDefault();

  let jsonFileValue = document.getElementById("json-input").files[0];
  if (!jsonFileValue) {
    errorArea.innerHTML =
      "<strong>Please choose a JSONResume file before visualizing.</strong>";
    return;
  }

  if (!jsonFileValue.text) {
    errorArea.innerHTML =
      "<strong>Your browser does not support file parsing in this app. Please try Chrome, Firefox, or Safari.</strong>";
    return;
  }

  try {
    const rawJson = await jsonFileValue.text();
    const json = JSON.parse(rawJson);
    const links = [];

    if (!Array.isArray(json.skills)) {
      throw new Error("The uploaded JSONResume file is missing a valid skills array.");
    }

    json.skills.forEach(function (skill) {
      const keywords = Array.isArray(skill.keywords) ? skill.keywords : [];

      keywords.forEach(function (keyword) {
        links.push({
          source: skill.name,
          target: keyword,
          value: setSkillValue(skill.level)
        });
      });
    });

    errorArea.innerHTML = "";
    forceLayoutVisualize(links);
  } catch (error) {
    errorArea.innerHTML =
      "<strong>There was a problem reading your JSONResume file: " +
      error.message +
      "</strong>";
  }
};

/* 
	Event Handlers
*/

// user has uploaded json file and clicked on submit button
document
  .getElementById("json-input-button")
  .addEventListener("click", convertJson, false);

/* 
	Helper Functions
*/

// set skill value numeric value from json value
const setSkillValue = function (level) {
  var skillLevelValue = 0;

  if (level === "Beginner") {
    skillLevelValue = 1.0;
  } else if (level === "Intermediate") {
    skillLevelValue = 2.0;
  } else if (level === "Advanced") {
    skillLevelValue = 2.5;
  }

  return skillLevelValue;
};
