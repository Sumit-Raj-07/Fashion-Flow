// =====================================================
// PERSON 3 - Design cards, stages, Comments, Version History,
//            Client and Production Manager
// =====================================================

// ---------- Design card (used by every role) ----------

const stageNames = { Draft: "Draft", Review: "In Review", Approved: "Approved" };

// builds one design card. "buttons" is the HTML of the role-specific buttons
function cardHTML(d, buttons) {
  // status text -> css class, e.g. "Draft" -> "s-draft", "Pending Client Review" -> "s-pending"
  const statusClass = "s-" + d.status.split(" ")[0].toLowerCase();

  return `
    <div class="card">
      <img src="${d.image}" alt="${d.title}">
      <div class="card-body">
        <span class="status ${statusClass}">${d.status}</span>
        <h3>${d.title} <small>v${d.version}</small></h3>
        <p class="fabric"><span class="swatch" style="background:${d.color}"></span>${d.fabric}</p>
        <p class="notes">${d.notes}</p>
        <div class="actions">${buttons}</div>
        ${commentsHTML(d)}
        ${historyHTML(d)}
      </div>
    </div>`;
}

// shows the designs grouped by stage (Draft, In Review, Approved)
// "buttonsFn" is a function that gives the buttons for one design
function showSections(list, stages, buttonsFn) {
  let html = "";

  stages.forEach(stage => {
    const items = list.filter(d => stageOf(d.status) === stage);

    let cards = "";
    items.forEach(d => {
      cards += cardHTML(d, buttonsFn(d));
    });
    if (cards === "") cards = '<p class="empty">No designs in this stage.</p>';

    html += `
      <div class="stage-head stage-${stage}">
        <h2>${stageNames[stage]}</h2>
        <span class="count">${items.length}</span>
      </div>
      <div class="grid">${cards}</div>`;
  });

  document.getElementById("designList").innerHTML = html;
}

// ---------- Comments (shown on every card, for all three users) ----------

// builds the comment list and the box to write a new comment
function commentsHTML(d) {
  let list = "";
  d.comments.forEach(c => {
    list += `<div class="comment"><b>${c.by}</b> <small>${c.date}</small><br>${c.text}</div>`;
  });
  if (list === "") list = '<p class="empty">No comments yet.</p>';

  return `
    <h4>Comments</h4>
    <div class="scroll-box">${list}</div>
    <textarea id="c${d.id}" rows="2" placeholder="Write a comment..."></textarea>
    <button class="btn grey small" onclick="postComment(${d.id})">Add Comment</button>`;
}

// reads the text typed in the comment box of one card
function getCommentText(id) {
  return document.getElementById("c" + id).value.trim();
}

// saves a comment written by any of the three users
function postComment(id) {
  const text = getCommentText(id);
  if (text === "") {
    alert("Please write a comment first.");
    return;
  }
  addComment(findDesign(id), text);
  saveDesigns();
  refresh();
}

// ---------- Version history (shown on every card) ----------

// builds the list of everything that happened to a design
function historyHTML(d) {
  let items = "";
  d.history.forEach(h => {
    items += `<li>${h}</li>`;
  });

  return `
    <h4>Version History</h4>
    <ul class="history scroll-box">${items}</ul>`;
}

// ---------- Client ----------

function renderClient() {
  // decides which buttons each card gets
  function buttons(d) {
    if (d.status === "Pending Client Review") {
      return `<button class="btn orange" onclick="requestChanges(${d.id})">Ask for Changes</button>
              <button class="btn green" onclick="approveDesign(${d.id})">Approve</button>`;
    }
    return "";
  }

  // the client does not see the designer's drafts
  const visible = designs.filter(d => d.status !== "Draft");
  showSections(visible, ["Review", "Approved"], buttons);
}

// client asks for changes: the text in the comment box becomes the request
function requestChanges(id) {
  const text = getCommentText(id);
  if (text === "") {
    alert("Please write the changes you want in the comment box.");
    return;
  }
  const d = findDesign(id);
  addComment(d, text);
  d.status = "Changes Requested";
  addHistory(d, "Client asked for changes");
  saveDesigns();
  renderClient();
}

// client approves: the design goes to the production manager
function approveDesign(id) {
  const d = findDesign(id);
  const text = getCommentText(id);
  if (text !== "") addComment(d, text);   // comment is optional here
  d.status = "Approved by Client";
  addHistory(d, "Approved by Client");
  saveDesigns();
  renderClient();
}

// ---------- Production Manager ----------

function renderProduction() {
  // decides which buttons each card gets
  function buttons(d) {
    if (d.status === "Approved by Client") {
      return `<button class="btn green" onclick="decide(${d.id}, true)">Accept</button>
              <button class="btn red" onclick="decide(${d.id}, false)">Reject</button>`;
    }
    return "";
  }

  // the production manager only sees designs the client has approved
  const visible = designs.filter(d => stageOf(d.status) === "Approved");
  showSections(visible, ["Approved"], buttons);
}

// production manager accepts (true) or rejects (false) a design
function decide(id, accepted) {
  const d = findDesign(id);
  const text = getCommentText(id);
  if (text !== "") addComment(d, text);   // comment is optional here

  if (accepted) {
    d.status = "Accepted for Production";
    addHistory(d, "Accepted by Production Manager");
  } else {
    d.status = "Rejected by Production";
    addHistory(d, "Rejected by Production Manager");
  }
  saveDesigns();
  renderProduction();
}
