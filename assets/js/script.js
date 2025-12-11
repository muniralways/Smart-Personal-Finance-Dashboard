// Initial Data
let transactions = JSON.parse(localStorage.getItem("transactions")) || [] ;

// DOM
const filterType = document.getElementById("filter-type");
const filterMonth = document.getElementById("filter-month");
const tableBody = document.getElementById("tableBody");

// Summary DOM
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const totalEl = document.getElementById("total");

// Input DOM
const dateInput = document.getElementById("dateInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");
const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");

// data not found element
const noResult = document.getElementById("noResult");

document.addEventListener("DOMContentLoaded", () => {

// ⬇️ Your entire JS code here
// Initial Data
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ... all functions ...

renderDashboard();

});



// ✅ You will implement these
 function filterByType(data, type) {
 if( type  === "all") return data;
 return data.filter(tr => tr.type === type)
}

function filterByMonth(data, month) {
if( month === "all") return data;
return data.filter (tr => tr.date.startsWith(month))

}
function calculateTotal(data) {
  let total = 0;
  data.forEach(tr => total += tr.amount)
return total;
}

function deleteTransaction(id) {
transactions = transactions.filter(tr => String(tr.id) !== String(id));

localStorage.setItem("transactions", JSON.stringify(transactions));

renderDashboard();

console.log(id);






}

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
      <td>${index + 1}</td>
      <td>${tr.date}</td>
      <td>${tr.type}</td>
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

  // Attach Event Listeners to Delete Buttons

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
// Debounce Lag Free function

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
  
  renderTable(data);



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
function addTransaction(e) {
  


  const date = dateInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const id =  'tr' + new Date().getTime() + Math.random().toString(36).slice(2)

if(!date || !amount || !type ){
  alert ("Please fill all fields")
  return
}

if(editId){
   transactions = transactions.map(tr => 
    String(tr.id) === String(editId)
        ? { ...tr, date, amount, type }
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
  type
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
searchInput.addEventListener("input", smoothSearch);
sortAmount.addEventListener("change", renderDashboard);
// Initial Load
renderDashboard();
