const addBox = document.querySelector(".add-box"),
  closePop = document.querySelector(".uil-times"),
  popupBox = document.querySelector(".popup-box"),
  popupBoxBtn = document.querySelector(".popup-box button"),
  popupBoxHeader = document.querySelector(".popup-box header p"),
  titleElm = document.querySelector(".popup-box input"),
  descriptionElm = document.querySelector(".popup-box textarea"),
  wrapper = document.querySelector(".wrapper");
let IS_UPDATE = false;
let NOTE_ID = null;

function clearNotePopUp() {
  titleElm.value = "";
  descriptionElm.value = "";
}
function setNoteLocalStorage(allNote) {
  localStorage.setItem("notes", JSON.stringify(allNote));
}
function removeNotesFromDom() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
}
function generateNotes(allNote) {
  removeNotesFromDom();
  let newNote;
  allNote.forEach((note) => {
    newNote = `
    <li class="note">
    <div class="details">
      <p>Title: ${note.title}</p>
      <span>Description: ${note.description}</span>
    </div>
    <div class="bottom-content">
      <span>${note.time}</span>
      <div class="settings" >
        <i class="uil uil-ellipsis-h" onclick=openSetting(this)></i>
        <ul class="menu">
          <li onclick="editNote(${note.id},'${note.title}','${note.description}')">
            <i class="uil uil-pen"></i>Edit
          </li>
          <li onclick=deleteNote(${note.id})>
            <i class="uil uil-trash" ></i>Delete
          </li>
        </ul>
      </div>
    </div>
  </li>  
    `;
    wrapper.insertAdjacentHTML("beforeend", newNote);
  });
}
function generateId() {
  return Math.floor(Math.random() * 1000000);
}
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}
function deleteNote(id) {
  const filteredNotes = getNotes().filter((note) => +note.id !== +id);
  setNoteLocalStorage(filteredNotes);
  generateNotes(filteredNotes);
}
function editNote(id, description, title) {
  IS_UPDATE = true;
  NOTE_ID = id;
  openModal(description, title);
}

function openSetting(elm) {
  document
    .querySelectorAll(".wrapper .settings")
    .forEach((menu) => menu.classList.remove("show"));
  elm.parentElement.classList.add("show");
  document.onclick = closeSetting;
}

function getTime() {
  let time = new Date();
  return time.toLocaleString();
}
function getEditNoteIndex() {
  return IS_UPDATE && getNotes().findIndex((note) => +note.id === +NOTE_ID);
}
function saveNote() {
  const allNotes = getNotes();
  const noteIndex = getEditNoteIndex();

  if (titleElm.value && descriptionElm.value) {
    const note = {
      id: IS_UPDATE ? allNotes[noteIndex].id : generateId(),
      title: titleElm.value,
      description: descriptionElm.value,
      time: `${IS_UPDATE ? "edited: " : ""}${getTime()}`,
    };
    IS_UPDATE ? (allNotes[noteIndex] = note) : allNotes.push(note);
    setNoteLocalStorage(allNotes);
    generateNotes(allNotes);
    closeModal();
    IS_UPDATE = false;
  }
}
function openModal(title, description) {
  if (IS_UPDATE) {
    console.log(title, description);
    popupBoxBtn.innerHTML = "Update note";
    popupBoxHeader.innerHTML = "Update your note";
    titleElm.value = title;
    descriptionElm.value = description;
  } else {
    clearNotePopUp();
    popupBoxBtn.innerHTML = "Add note";
    popupBoxHeader.innerHTML = "Add your new note";
  }
  popupBox.classList.add("show");
}
function closeModal() {
  popupBox.classList.remove("show");
  clearNotePopUp();
}
function closeSetting(event) {
  if (!event.target.closest(".settings")) {
    document
      .querySelectorAll(".wrapper .settings")
      .forEach((menu) => menu.classList.remove("show"));
  }
}

window.onload = () => generateNotes(getNotes());
addBox.onclick = openModal;
closePop.onclick = closeModal;
popupBoxBtn.onclick = saveNote;
