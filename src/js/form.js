document.addEventListener("DOMContentLoaded", function () {
  const addIssueBtn = document.getElementById("add-issue-btn");
  const formContainer = document.getElementById("form");
  const btnCancel= document.getElementById("cancel-btn");
  const bg= document.getElementById("form-section");

  

  
  addIssueBtn.addEventListener("click", function () {
    formContainer.classList.remove("hidden");
    bg.classList.remove("hidden");
  });
  btnCancel.addEventListener("click", function(){
    formContainer.classList.add("hidden");
    bg.classList.add("hidden");
  })

 

});