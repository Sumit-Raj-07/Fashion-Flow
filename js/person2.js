// =====================================================
// PERSON 2 - Login / logout, and the Designer:
//            add, revise, send and delete sketches
// =====================================================

// ---------- Login and logout ----------

// checks the username and password, then opens the dashboard
function login() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  const found = users.find(u => u.username === name && u.password === pass);

  if (!found) {
    document.getElementById("loginError").innerText = "Wrong username or password.";
    return;
  }

  currentUser = found;
  localStorage.setItem("currentUser", JSON.stringify(found));
  document.getElementById("loginError").innerText = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  openDashboard();
}

// logs the user out and goes back to the home page
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  document.getElementById("navLogin").classList.remove("hidden");
  document.getElementById("navLogout").classList.add("hidden");
  showHome();
}

// ---------- Designer: show the cards ----------

// id of the design being revised (null means we are adding a new one)
let editingId = null;

function renderDesigner() {
  // decides which buttons each card gets
  function buttons(d) {
    if (d.status === "Draft") {
      return `<button class="btn" onclick="sendDraft(${d.id})">Send to Client</button>
              <button class="btn red" onclick="deleteDraft(${d.id})">Delete</button>`;
    }
    if (d.status === "Changes Requested") {
      return `<button class="btn orange" onclick="startRevision(${d.id})">Revise</button>`;
    }
    return "";
  }

  // the designer sees all three stages
  showSections(designs, ["Draft", "Review", "Approved"], buttons);
}

// ---------- Designer: add a new sketch / save a revision ----------

// send = true  -> send to the client
// send = false -> only save as a draft
function submitDesign(send) {
  const title = document.getElementById("fTitle").value.trim();
  const fabric = document.getElementById("fFabric").value.trim();
  const color = document.getElementById("fColor").value;
  const notes = document.getElementById("fNotes").value.trim();
  const file = document.getElementById("fImage").files[0];

  // check that the form is filled
  if (title === "" || fabric === "") {
    document.getElementById("formError").innerText = "Please enter a design name and fabric.";
    return;
  }
  if (editingId === null && !file) {
    document.getElementById("formError").innerText = "Please choose a sketch image.";
    return;
  }

  // a revision is always sent back to the client
  if (editingId !== null) send = true;

  // read the chosen image first (if there is one), then save
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      saveDesign(title, fabric, color, notes, reader.result, send);
    };
    reader.readAsDataURL(file);
  } else {
    saveDesign(title, fabric, color, notes, null, send);
  }
}

// saves a new design, or updates the one being revised
function saveDesign(title, fabric, color, notes, image, send) {
  if (editingId !== null) {
    // REVISION: keep the old version in the history, then update the design
    const d = findDesign(editingId);
    addHistory(d, "v" + d.version + " was: " + d.fabric + ", " + d.color);
    d.version++;
    d.title = title;
    d.fabric = fabric;
    d.color = color;
    d.notes = notes;
    if (image) d.image = image;
    d.status = "Pending Client Review";
    addHistory(d, "v" + d.version + " sent to client");
  } else {
    // NEW DESIGN
    const d = {
      id: Date.now(),
      title: title,
      image: image,
      fabric: fabric,
      color: color,
      notes: notes,
      status: send ? "Pending Client Review" : "Draft",
      version: 1,
      comments: [],
      history: []
    };
    addHistory(d, send ? "v1 created and sent to client" : "v1 saved as draft");
    designs.push(d);
  }

  editingId = null;
  saveDesigns();
  clearForm();
  renderDesigner();
}

// ---------- Designer: draft buttons ----------

// sends a saved draft to the client
function sendDraft(id) {
  const d = findDesign(id);
  d.status = "Pending Client Review";
  addHistory(d, "v" + d.version + " sent to client");
  saveDesigns();
  renderDesigner();
}

// deletes a draft (drafts are the only designs that can be deleted)
function deleteDraft(id) {
  if (!confirm("Delete this draft sketch?")) return;
  designs = designs.filter(d => d.id !== id);
  saveDesigns();
  renderDesigner();
}

// ---------- Designer: revise a design the client asked changes for ----------

// fills the form with the design's details so the designer can change them
function startRevision(id) {
  const d = findDesign(id);
  editingId = id;

  document.getElementById("fTitle").value = d.title;
  document.getElementById("fFabric").value = d.fabric;
  document.getElementById("fColor").value = d.color;
  document.getElementById("fNotes").value = d.notes;
  document.getElementById("formTitle").innerText = "Revise: " + d.title + " (a new image is optional)";
  document.getElementById("draftBtn").classList.add("hidden");
  document.getElementById("cancelBtn").classList.remove("hidden");
  window.scrollTo(0, 0);
}

function cancelRevision() {
  editingId = null;
  clearForm();
}

// empties the form and puts it back to "add new sketch" mode
function clearForm() {
  document.getElementById("fTitle").value = "";
  document.getElementById("fFabric").value = "";
  document.getElementById("fColor").value = "#cccccc";
  document.getElementById("fNotes").value = "";
  document.getElementById("fImage").value = "";
  document.getElementById("formError").innerText = "";
  document.getElementById("formTitle").innerText = "Add New Sketch";
  document.getElementById("draftBtn").classList.remove("hidden");
  document.getElementById("cancelBtn").classList.add("hidden");
}
