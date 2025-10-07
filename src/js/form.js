document.addEventListener("DOMContentLoaded", function () {
  const addIssueBtn = document.getElementById("add-issue-btn");
  const formContainer = document.getElementById("form");
  const btnCancel= document.getElementById("cancel-btn");
  const countbacklog = document.getElementById("backlog-count");
  const countprogress = document.getElementById("in-progress-count");
  const countcomplete = document.getElementById("complete-count");
  

  

  
  addIssueBtn.addEventListener("click", function () {
    formContainer.classList.remove("hidden");
  });
  btnCancel.addEventListener("click", function () {
    formContainer.classList.add("hidden");
  });
  
  
 

});