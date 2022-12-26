const BASE_CATEGORY = 0;
const SIMD_FP_CATEGORY = 1;

function setupInstructions() {
    const instructions = [];

    const categoryClasses = [
        "base-instruction",
        "simd-fp-instruction",
    ];

    for (const key in instructionDefinitions) {
        const value = instructionDefinitions[key];

        const slash = key.lastIndexOf("/");
        const category = key.substring(0, slash);

        let categoryIndex = -1;
        if (category == "Base-Instructions") {
            categoryIndex = BASE_CATEGORY;
        } else if (category == "SIMD-FP-Instructions") { 
            categoryIndex = SIMD_FP_CATEGORY;
        } else {
            continue;
        }

        const path = "docs/" + key.substring(slash + 1) + ".html";
        const name = value.substring(0, value.indexOf(":"));

        let searchableName = name.toLowerCase();
        {
            const openParen = searchableName.indexOf("(");
            if (openParen != -1) {
                searchableName = searchableName.substr(0, openParen);
            }
        }

        instructions.push({
            name,
            path,
            searchableName: searchableName.trim(),
            categoryIndex,
        });
    }

    instructions.sort((a, b) => {
        const nameA = a.searchableName;
        const nameB = b.searchableName;

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }
    
        return 0;
    });

    let previousSelected = undefined;

    const instructionsElement = document.getElementById("instructions");
    for (const instruction of instructions) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const a = document.createElement("a");
        const text = document.createTextNode(instruction.name);

        a.href = instruction.path;
        a.target = "instruction-description";
        a.classList.add(categoryClasses[instruction.categoryIndex]);
        
        a.addEventListener("click", () => {
            if (previousSelected) {
                previousSelected.classList.remove("currentlySelected");
            }
            previousSelected = a;
            previousSelected.classList.add("currentlySelected");
        });

        tr.appendChild(td);
        td.appendChild(a);
        a.appendChild(text);
        instructionsElement.appendChild(tr);

        instruction.element = tr;
    }

    return instructions;
}

const instructions = setupInstructions();
let lastFilterText = "";
let lastEnableSimd = true;

function filter(text, enableSimd) {
    lastFilterText = text;
    lastEnableSimd = enableSimd;

    for (const instruction of instructions) {
        if ((enableSimd || instruction.categoryIndex != SIMD_FP_CATEGORY) &&
            instruction.searchableName.includes(text)) {
            instruction.element.style.display = ""; 
        } else {
            instruction.element.style.display = "none"; 
        }
    }
}

const searchBox = document.getElementById("search-box");

searchBox.oninput = () => {
    const text = searchBox.value.toLowerCase().trim();
    filter(text, lastEnableSimd);
};

document.onkeydown = (event) => {
    if (event.key == "F1") {
        filter(lastFilterText, !lastEnableSimd);
    }
};