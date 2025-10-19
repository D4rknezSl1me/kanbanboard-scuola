document.addEventListener("DOMContentLoaded", function () {
  const addIssueBtn = document.getElementById("add-issue-btn");
  const formContainer = document.getElementById("form");
  const formContainerEdit = document.getElementById("form-edit");
  const btnCancel= document.getElementById("cancel-btn");
  const btnAdd = document.getElementById("issue-btn1")
  const btnCancel2= document.getElementById("cancel-btn2");
  const btnAdd2 = document.getElementById("issue-btn2")
  const countbacklog = document.getElementById("backlog-count");
  const countprogress = document.getElementById("in-progress-count");
  const countcomplete = document.getElementById("complete-count");
  
  const bg= document.getElementById("form-section");
  const bg2 = document.getElementById("form-section-edit");

  

  
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

  btnAdd2.addEventListener("click", function () {
    formContainerEdit.classList.remove("hidden");
    bg2.classList.remove("hidden");
  });
  btnCancel2.addEventListener("click", function () {
    formContainerEdit.classList.add("hidden");
    bg2.classList.add("hidden");
    
  });
  
 

});