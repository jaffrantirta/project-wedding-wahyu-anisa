const SUPABASE_URL = "https://akfcdsyhtihvsokklflu.supabase.co";
const SUPABESE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZmNkc3lodGlodnNva2tsZmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2ODYyNDMsImV4cCI6MjAxNTI2MjI0M30.rxjOf3ZY4yov8TIleP_72YGPBQOHELjhebrHgwGY_7E";
const SUPABASE_EVENT_ID = 1;
let renderedComments = [];

const core = supabase.createClient(SUPABASE_URL, SUPABESE_KEY);

async function submitForm() {
  $("#butsave").attr("disabled", "disabled");
  const name = document.getElementById("name").value;
  const wish = document.getElementById("wish").value;
  const attend = document.querySelector('input[name="attend"]:checked').value;
  console.log(attend);
  if (name != "" && attend != "" && wish != "") {
    const { error } = await core.from("comments").insert([
      {
        note: wish,
        attributes: {
          author: name,
          is_attend: attend,
        },
        event: SUPABASE_EVENT_ID,
      },
    ]);

    if (error) {
      alert("Ups! Ada yang gak beres.");
      return;
    }
    $("#butsave").removeAttr("disabled");

    $("#showNotif").html("Ucapan terkirim");
    $("#rsvp-form")[0].reset();
    $("#showNotif").fadeIn("slow");
    setTimeout(function () {
      $("#showNotif").fadeOut("slow");
    }, 3000);
    fetchData();
  } else {
    $("#showError").html("Mohon lengkapi form");
    $("#showError").fadeIn("slow");
    setTimeout(function () {
      $("#showError").fadeOut("slow");
    }, 2000);
  }
}

async function fetchData() {
  let { data: comments, error } = await core
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return false;
  }
  const newComments = comments.filter(
    (comment) => !renderedComments.includes(comment.id)
  );
  renderComments(newComments);
  renderedComments = comments.map((comment) => comment.id);
}

function renderComments(comments) {
  const commentContainer = document.getElementById("commentContainer");

  comments.forEach((comment) => {
    const newComment = document.createElement("div");
    newComment.classList.add("box_ucapan");

    newComment.innerHTML = `
          <div class='row_ucapan p-1'>
              <div class='card'>
                  <div class='card-body'>
                      <blockquote class=''>
                          <p>${comment.note}</p>
                          <footer class='blockquote-footer small p-1'>
                              <span class='ucapan_nama'>
                                  ${comment.attributes.author},
                                  <span class='ucapan-hadir'>${
                                    comment.attributes.is_attend === "true" ||
                                    comment.attributes.is_attend === true
                                      ? "Hadir"
                                      : "Tidak Hadir"
                                  }</span>
                              </span>
                          </footer>
                      </blockquote>
                  </div>
              </div>
          </div>
      `;

    commentContainer.appendChild(newComment);
  });
}

fetchData();
