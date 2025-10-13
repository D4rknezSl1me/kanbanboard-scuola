document.addEventListener("DOMContentLoaded", function () {
  const addIssueBtn = document.getElementById("add-issue-btn");
  const formContainer = document.getElementById("form");
  const btnCancel= document.getElementById("cancel-btn");
  const btnAdd = document.getElementById("issue-btn1")
  const countbacklog = document.getElementById("backlog-count");
  const countprogress = document.getElementById("in-progress-count");
  const countcomplete = document.getElementById("complete-count");
  
  const bg= document.getElementById("form-section");

  

  
  addIssueBtn.addEventListener("click", function () {
    formContainer.classList.remove("hidden");
    bg.classList.remove("hidden");
  });
  btnCancel.addEventListener("click", function () {
    formContainer.classList.add("hidden");
    bg.classList.add("hidden");
  });
  btnAdd.addEventListener("click", function () {
    bg.classList.add("hidden");
  });
  
  
 

});