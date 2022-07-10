const addBox = document.querySelector(".add-box"),
  closePop = document.querySelector(".uil-times"),
  popupBox = document.querySelector(".popup-box"),
  popupBoxBtn = document.querySelector(".popup-box button"),
  popupBoxHeader = document.querySelector(".popup-box header p"),
  title = document.querySelector(".popup-box input"),
  description = document.querySelector(".popup-box textarea"),
  wrapper = document.querySelector(".wrapper");
let IS_UPDATE = false;
let IS_UPDATE_ID = null;
let notes = [];

function clearNotePopUp() {
  title.value = "";
  description.value = "";
}
function getNoteLocalStorage() {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  generateNotes(notes);
}
function setNoteLocalStorage(allNote) {
  localStorage.setItem("notes", JSON.stringify(allNote));
}
function generateNotes(allNote) {
  document.querySelectorAll(".note").forEach((note) => note.remove());
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
          <li onclick=editNote(${note.id})>
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
function deleteNote(id) {
  notes = notes.filter((note) => +note.id !== +id);
  setNoteLocalStorage(notes);
  generateNotes(notes);
}
function editNote(id) {
  IS_UPDATE = true;
  IS_UPDATE_ID = id;
  openModal(id);
}

function openSetting(elm) {
  document
    .querySelectorAll(".wrapper .settings")
    .forEach((menu) => menu.classList.remove("show"));
  elm.parentElement.classList.add("show");
}

function getTime() {
  let time = new Date();
  return time.toLocaleString();
}
function getEditNoteIndex() {
  return IS_UPDATE && notes.findIndex((note) => +note.id === +IS_UPDATE_ID);
}
function saveNote() {
  const noteIndex = getEditNoteIndex();
  if (title.value && description.value) {
    const note = {
      id: IS_UPDATE ? notes[noteIndex].id : generateId(),
      title: title.value,
      description: description.value,
      time: `${IS_UPDATE ? "edited: " :""}${getTime()}`,
    };
    IS_UPDATE ? (notes[noteIndex] = note) : notes.push(note);
    setNoteLocalStorage(notes);
    generateNotes(notes);
    closeModal();
    IS_UPDATE = false;
  }
}
function openModal(id = null) {
  if (IS_UPDATE) {
    popupBoxBtn.innerHTML = "Update note";
    popupBoxHeader.innerHTML = "Update your note";
    notes.find((note) => {
      if (+note.id === +id) {
        title.value = note.title;
        description.value = note.description;
        return;
      }
    });
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

window.onload = getNoteLocalStorage;
addBox.onclick = openModal;
closePop.onclick = closeModal;
popupBoxBtn.onclick = saveNote;
document.onclick = closeSetting;
