const textarea=document.querySelector("textarea");
const savbtn=document.querySelector("#save");
const delbtn=document.querySelector("#del");
const postbox=document.querySelector("#postbox");
const editbtn=document.querySelector("#edit");
const complbtn=document.querySelector("#complete");
const clrbtn=document.querySelector("#clrall");
let blogs=[];
let selecteditem = null;
let isEditing = false;
let saved = localStorage.getItem("blogs");
if (saved) {
    blogs = JSON.parse(saved);
    blogs.forEach((blog, i) => {
        let blogitem = document.createElement("div");
        let title = blog.text.split("\n")[0];
        blogitem.innerText = title + " " + blog.status;
        blogitem.fulltext = blog.text;
        blogitem.status = blog.status;
        blogitem.index = i;
        blogitem.addEventListener("click", () => {
            if (selecteditem) {
                selecteditem.classList.remove("selected");
            }
            blogitem.classList.add("selected");
            textarea.value = blogitem.fulltext;
            selecteditem = blogitem;
        });
        postbox.appendChild(blogitem);
    });
}
clrbtn.addEventListener("click",()=>{
    textarea.value=null;
});
editbtn.addEventListener("click", () => {
    if (selecteditem) {
        isEditing = true;
    } else {
        alert("Select a blog first");
    }
});
complbtn.addEventListener("click", () => {
    if (!selecteditem) {
        alert("select a task first");
        return;
    }
    selecteditem.status = selecteditem.status === "(C)" ? "(N)" : "(C)";
    let title = selecteditem.fulltext.split("\n")[0];
    selecteditem.innerText = title + " " + selecteditem.status;
    let index = selecteditem.index;
    blogs[index].status = selecteditem.status;
    localStorage.setItem("blogs", JSON.stringify(blogs));
    isEditing = true;
});
savbtn.addEventListener("click", () => {
    let text = textarea.value;
    let title = text.split("\n")[0];
    if (title === "") {
        alert("u can not save without writing");
        return;
    }
    if (selecteditem && isEditing) {
        selecteditem.innerText = title + " " + selecteditem.status;
        selecteditem.fulltext = text;
        let index = selecteditem.index;
        blogs[index].text = text;
        localStorage.setItem("blogs", JSON.stringify(blogs));
    } else if (!selecteditem) {
        let newBlog = {
            text: text,
            status: "(N)"
        };
        blogs.unshift(newBlog);
        localStorage.setItem("blogs", JSON.stringify(blogs));
        let blogitem = document.createElement("div");
        blogitem.status = "(N)";
        blogitem.innerText = title + " " + blogitem.status;
        blogitem.fulltext = text;
        blogitem.index = blogs.length - 1;
        blogitem.addEventListener("click", () => {
            if (selecteditem) {
                selecteditem.classList.remove("selected");
            }
            blogitem.classList.add("selected");
            textarea.value = blogitem.fulltext;
            selecteditem = blogitem;
        });
        let titleDiv = document.querySelector("#posttitle");
        titleDiv.after(blogitem);
    } else {
        alert("Click EDIT to edit this task");
        return;
    }
    textarea.value = "";
    selecteditem = null;
    isEditing = false;
});
delbtn.addEventListener("click", () => {
    if (!selecteditem) {
        alert("Select a task first");
        return;
    }
    let index = selecteditem.index;
    blogs.splice(index, 1);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    selecteditem.remove();
    textarea.value = "";
    selecteditem = null;
    Array.from(postbox.children).forEach((item, i) => {
        item.index = i;
    });
});