//get data from local storage
let category = JSON.parse(localStorage.getItem("category")) || [ ];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [] ;
 ;




const filterType = document.getElementById("filter-type");
const filterMonth = document.getElementById("filter-month");
const tableBody = document.getElementById("tableBody");


const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const totalEl = document.getElementById("total");


const dateInput = document.getElementById("dateInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");
const addBtn = document.getElementById("addBtn");
const gategoryInput = document.getElementById("categoryInput");
const searchInput = document.getElementById("searchInput");
const modalbtn_renader = document.getElementById("modalbtn_renader")
// category table body
const Cat_tableBody = document.getElementById("Cat_tableBody");

// category 

  const categoryFromInput = document.getElementById('categoryInput-modal');
  const getCategoryBtn = document.getElementById('getCategoryBtn');

// data not found element
const noResult = document.getElementById("noResult");

document.addEventListener("DOMContentLoaded", () => {




// ... all functions ...

renderDashboard();

});


// pagination


let currentPage = 1;
const rowPerpage = 5;



function getPaginate (data){
  const start = (currentPage -1) * rowPerpage;
  const  end = start + rowPerpage;
   return data.slice(start, end)
}


// renderpagination

function renderPagination (totalRows) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPage = Math.ceil(totalRows / rowPerpage);

  for(let i =1; i <=totalPage; i ++){
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active"  : ""}`;
    
    
     li.innerHTML = `<a class="page-link" href="#">${i}</a>`

    li.addEventListener("click", e => {
      e.preventDefault();
      currentPage = i;
      renderDashboard()
    })
pagination.appendChild(li)
  }

}

// filter functions

 function filterByType(data, type) {
 if( type  === "all") return data;
 return data.filter(tr => tr.type === type)
}


//month filter
function filterByMonth(data, month) {
if( month === "all") return data;
return data.filter (tr => tr.date.startsWith(month))

}

// total  cal
function calculateTotal(data) {
  let total = 0;
  data.forEach(tr => total += tr.amount)
return total;
}


// delte funcion
function deleteTransaction(id) {
transactions = transactions.filter(tr => String(tr.id) !== String(id));

localStorage.setItem("transactions", JSON.stringify(transactions));

renderDashboard();




}


// summmay
function getSummary(data) {
  let income = 0;
  let expense = 0;

  data.forEach(tr => {
    if (tr.type === "income") income += tr.amount;
    if (tr.type === "expense") expense += tr.amount;
  });

  return {
    income,
    expense,
    balance: income - expense
  };
}


function renderTable(data) {
  tableBody.innerHTML = "";

  if(data.length === 0  && searchInput.value.trim().length  > 0){
    noResult.classList.remove("d-none")
  }else{
    noResult.classList.add("d-none")
  }

  data.forEach((tr, index )=> {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${(currentPage - 1) * rowPerpage + index + 1}</td>

      <td>${tr.date}</td>
      <td>${tr.type}</td>
      <td>${tr.gategory}</td>
      <td>${tr.amount}</td>
      <td>
        <button class=" edit-btn btn btn-warning btn-sm" data-id ='${tr.id}'>
          Edit
        </button>
        <button class="delete-btn btn btn-danger btn-sm" data-id ='${tr.id}'>
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);



  });

  // Delete Buttons

document.querySelectorAll(".delete-btn").forEach(btn =>{
  btn.addEventListener("click", ()=> {
    deleteTransaction(btn.dataset.id)
  })
})

// Edit buttons event 

document.querySelectorAll(".edit-btn").forEach( btn =>{
  btn.addEventListener("click", ()=> {
    editTransaction(btn.dataset.id)
  })
})

}
window.deleteTransaction = deleteTransaction;


//leg free funtion

function debounce (fn, delay = 400 ){

  let timeout;

  return (...args)=> {
    clearTimeout (timeout);
    timeout = setTimeout (()=>{
      fn.apply(this, args);
    }, delay)
    
  }
}

const smoothSearch = debounce (renderDashboard, 300);

// short Funciton

function sortByAmount (data, order) {
if(order === "asc") return data;

return [...data].sort((a,b ) =>{
  
if(order === "asc") return a.amount - b.amount;
if(order === "desc") return b.amount - a.amount;

})

}






function renderDashboard() {
  const type = filterType.value;
  const month = filterMonth.value;
  const search = searchInput.value.toLowerCase();
   const sortAmount = document.getElementById("sortAmount").value;

  
  
  let data = filterByType(transactions, type);
  data = filterByMonth(data, month);
  
  data = data.filter(tr =>
    tr.date.toLowerCase().includes(search) ||
    tr.type.toLowerCase().includes(search) 
  )
  //sort
data= sortByAmount(data, sortAmount);





  const total = calculateTotal(data);
  const summary = getSummary(data);

  incomeEl.textContent = summary.income;  
  expenseEl.textContent = summary.expense;
  balanceEl.textContent = summary.income - summary.expense;
  totalEl.textContent = total;
  
  
  const paginationData = getPaginate(data);

  renderTable(paginationData);
  renderPagination(data.length)
  getCategory();
  randercategory();


}





// Edit
let editId = null;

function editTransaction(id) {
    const tr = transactions.find(tr => String(tr.id) === String(id));

    dateInput.value = tr.date
    amountInput.value = tr.amount
    typeInput.value = tr.type

editId = id
    addBtn.textContent = "update"


}
window.editTransaction = editTransaction;



// gategory input
let editCategoryId = null;
let oldCategoryName = null;


function addCategory (e) {

let  gateval = categoryFromInput.value.trim();

const id = 'cat' + new Date ().getTime() + Math.random().toString(36).slice(2)

if(!gateval){
  alert ("Please enter category")
  return
}


if(editCategoryId){
 
  category = category.map(cat =>
  cat.id === editCategoryId
    ? { ...cat, category: gateval }
    : cat
);

// transaction category auto update

transactions = transactions.map(tr => {
 return tr.gategory === oldCategoryName ? {... tr, gategory : gateval} : tr

})

  editCategoryId = null;
oldCategoryName = null;
  getCategoryBtn.textContent = "Add"

}else{

const newCategory = {

  id, 
  category: gateval
}
category.push (newCategory);

}
randercategory();




localStorage.setItem("category", JSON.stringify(category))

categoryFromInput.value = "";

  randercategory(category);


  getCategory();
  renderDashboard();
}

// category delete

function deleteCategory (id) {
 category = category.filter(cat => String(cat.id) !== String(id));

  localStorage.setItem("category", JSON.stringify(category))
  randercategory();
  getCategory();



}

// delete event 

Cat_tableBody.addEventListener("click", e => {
  if(e.target.classList.contains("delete-cat")){
    deleteCategory(e.target.dataset.id);
   
  }
});




// category edit




function editcategory (id){

  const cat = category.find (c => c.id === id);
  
  if(!cat) return;
categoryFromInput.value = cat.category
editCategoryId = id;
oldCategoryName = cat.category;
getCategoryBtn.textContent = "Update"

}


Cat_tableBody.addEventListener("click", e => {
 
  if(e.target.classList.contains("edit-cat")) {
editcategory(e.target.dataset.id);


    


  }
  
})




// category load on table

function randercategory (data = category) {
  Cat_tableBody.innerHTML = "";


  data.forEach((cat, index ) => {
 const row = document.createElement("tr")

row.innerHTML = `
<td>${index + 1}</td>
<td>${cat.category}</td>

<td>
        <button class=" edit-btn btn btn-warning btn-sm edit-cat"  data-id=${cat.id} >
          Edit
        </button>
        <button class="delete-btn btn btn-danger btn-sm delete-cat"  data-id=${cat.id}>
          Delete
        </button>
      </td>



`
console.log(cat.gategory);

Cat_tableBody.appendChild(row);
  })

  
}


// get category from local storage

function getCategory () {
  gategoryInput.innerHTML = `<option value="">Select Category</option>`;

  category.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.category;
    option.textContent = cat.category;
    gategoryInput.appendChild(option);
  });
}



// add transaction
function addTransaction(e) {
  


  const date = dateInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const gategory = gategoryInput.value
  const id =  'tr' + new Date().getTime() + Math.random().toString(36).slice(2)

if(!date || !amount || !type ){
  alert ("Please fill all fields")
  return
}

if(editId){
   transactions = transactions.map(tr => 
    String(tr.id) === String(editId)
        ? { ...tr, date, amount, type, gategory }
        : tr
);

     renderDashboard();
  editId = null;
    addBtn.textContent = "Add";
  

}else{
const newTransaction = {
  id,
  date,
  amount,
  type,
  gategory: gategoryInput.value
}
transactions.push (newTransaction)



}
localStorage.setItem("transactions", JSON.stringify(transactions))

dateInput.value = "";
amountInput.value = "";
typeInput.value = "income";

renderDashboard();

}




// Events
filterType.addEventListener("change", renderDashboard);
filterMonth.addEventListener("change", renderDashboard);
addBtn.addEventListener("click", addTransaction);


// gategory i
getCategoryBtn.addEventListener("click", addCategory);



searchInput.addEventListener("input", smoothSearch);
sortAmount.addEventListener("change", renderDashboard);
// Load
