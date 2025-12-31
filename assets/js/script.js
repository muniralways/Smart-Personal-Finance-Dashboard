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
const sortAmount = document.getElementById("sortAmount");

document.addEventListener("DOMContentLoaded", () => {
 renderCategoryChart();
  getCategory();
  randercategory();
  renderDashboard();

});

// 
// pagination


let currentPage = 1;
let rowPerpage = 5;


document.getElementById("pageSize").addEventListener("change", e => {
  rowPerpage = Number(e.target.value);
  currentPage =1;
  renderDashboard()
  
  

})


// getegory pagination

let catCurrentPage = 1;
let catRowPage = 5

document.getElementById("showCategoryPage").addEventListener("change", e =>{
catRowPage = Number(e.target.value) ;
catCurrentPage = 1;


randercategory()
})




// transaction pagination
function getPaginate (data){
  const start = (currentPage -1) * rowPerpage;
  const  end = start + rowPerpage;
   return data.slice(start, end)
}
// catPaginatio

function getCatPaginate (data){
  const start = (catCurrentPage -1) * catRowPage;
  const  end = start + catRowPage;
   return data.slice(start, end)
}

// render category pagination

function renderCatPagination (totalRows) {
  const Catpagination = document.getElementById("Catpagination");
  Catpagination.innerHTML = "";

  const totalPage = Math.ceil(totalRows / catRowPage);

  for(let i =1; i <=totalPage; i ++){
    const li = document.createElement("li");
    li.className = `page-item ${i === catCurrentPage ? "active"  : ""}`;
    
    
     li.innerHTML = `<a class="page-link" href="#">${i}</a>`

    li.addEventListener("click", e => {
      e.preventDefault();
      catCurrentPage = i;
      randercategory();
    });
Catpagination.appendChild(li)
  }

}
const showCategoryPage = document.getElementById("showCategoryPage");
if (showCategoryPage) {
  showCategoryPage.addEventListener("change", e => {
    catRowPage = Number(e.target.value);
    catCurrentPage = 1;
    randercategory();
  });
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


// page info

function RenderPageInfo (totalRows){

  const start = (currentPage - 1) * rowPerpage +1;
  const end = Math.min(start + rowPerpage - 1, totalRows);


  document.getElementById( "pageInfo").textContent = ` ${start}-${end} of ${totalRows }enrites`

}

// filter functions

 function filterByType(data, type) {

 currentPage = 1

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

// transaction delelte confirm

function showConfirmToast(msg, onConfirm) {
  const toast = document.getElementById("confirmToast");

  toast.innerHTML = `
    <p>⚠️ ${msg}</p>
    <div class="d-flex justify-content-end gap-2 mt-2">
      <button class="btn btn-danger btn-sm" id="confirmYes">Yes</button>
      <button class="btn btn-secondary btn-sm" id="confirmNo">No</button>
    </div>
  `;

  toast.classList.add("show");

  document.getElementById("confirmYes").onclick = () => {
    toast.classList.remove("show");
    onConfirm(true);
  };

  document.getElementById("confirmNo").onclick = () => {
    toast.classList.remove("show");
    onConfirm(false);
  };
}


// delte funcion
function deleteTransaction(id) {
  showConfirmToast("Are you sure ?" , (confirmed) => {
    if(confirmed) {
     transactions = transactions.filter(tr => String(tr.id) !== String(id));

localStorage.setItem("transactions", JSON.stringify(transactions));
 renderDashboard();
    }
  })






}


// summmay
function getSummary(data = transactions) {
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
if(order === "none") return data;

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

  console.log(sortAmount);
  
  
  let data = filterByType(transactions, type);
  data = filterByMonth(data, month);
  
  data = data.filter(tr =>
    tr.date.toLowerCase().includes(search) ||
    tr.type.toLowerCase().includes(search) 
  )
  //sort
data= sortByAmount(data, sortAmount);


data = [...data].reverse()


  const total = calculateTotal(data);
  const summary = getSummary(data);

  incomeEl.textContent = summary.income;  
  expenseEl.textContent = summary.expense;
  balanceEl.textContent = summary.income - summary.expense;
  totalEl.textContent = total;
  
  
  const paginationData = getPaginate(data);

  renderTable(paginationData);
  renderPagination(data.length);
  RenderPageInfo(data.length);

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

const catPaginateData = getCatPaginate(category)

  catPaginateData.forEach((cat, index ) => {
 const row = document.createElement("tr")

row.innerHTML = `
<td>${(catCurrentPage - 1) * catRowPage + index + 1}</td>

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


Cat_tableBody.appendChild(row);
  })







  renderCatPagination(category.length)
}

// fun chart

 function CatSummaryChart (){
   const summary = {};

   transactions.forEach ( tr => {
    if(!summary[tr.gategory]) summary[tr.gategory] = 0;
    summary[tr.gategory] += tr.amount;
   })
   return summary;

 }


//  function  chart render 


let totalChart;

function renderCategoryChart() {

  const totals = getSummary();

  if (totalChart) totalChart.destroy();

  totalChart = new Chart(
    document.getElementById("totalincomeAndExpenseChart"),
    {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount',
          data: [totals.income, totals.expense],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    }
  );
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