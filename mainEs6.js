const handleListClick = (event) => {
  console.log(event.target.tagName);

  if (event.target.tagName === "LI") {
    event.target.classList.toggle("checked");
  } else if (event.target.tagName === "SPAN") {
    event.target.parentElement.remove();
  }
};

const handleListDoubleClick = (event) => {
  if (event.target.tagName === "LI") {
    editTask(event.target);
  }
};

const handleInputKeyPress = (event) => {
  if (event.key === "Enter") {
    newElement();
  }
};

document.querySelector("ul").addEventListener("click", handleListClick);
document
  .querySelector("ul")
  .addEventListener("dblclick", handleListDoubleClick);
document
  .getElementById("myInput")
  .addEventListener("keypress", handleInputKeyPress);

const editTask = (element) => {
  const oldValue = element.firstChild.textContent.trim();
  const input = document.createElement("input");

  input.type = "text";
  input.value = oldValue;
  input.className = "editInput";

  element.innerHTML = "";
  element.appendChild(input);
  input.focus();

  input.addEventListener("blur", () => {
    saveTask(element, input, oldValue);
  });
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      saveTask(element, input, oldValue);
    }
  });
};

const saveTask = (element, input, oldValue) => {
  const newValue = input.value.trim();
  if (!newValue) {
    alert("You must write something!");
    element.innerHTML = `${oldValue}<span class="close">x</span>`;
  } else {
    element.innerHTML = `${newValue}<span class="close">x</span>`;
  }
};

const newElement = () => {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();

  if (!inputValue) {
    alert("You must write something!");
    return;
  }
  const li = document.createElement("li");
  li.innerHTML = `${inputValue}<span class="close">x</span>`;

  document.getElementById("myUL").appendChild(li);
  input.value = "";
};
