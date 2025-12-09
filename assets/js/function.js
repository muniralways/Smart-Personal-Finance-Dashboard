// // ✅ You will implement these
//  ওfunction filterByType(data, type) {
//  if( type  === "all") return data;
//  return data.filter(tr => tr.type === type)
// }

// function filterByMonth(data, month) {
// if( month === "all") return data;
// return data.filter (tr => tr.date.startsWith(month))

// }
// function calculateTotal(data) {
//   let total = 0;
//   data.forEach(tr => total += tr.amount)
// return total;
// }

// function deleteTransaction(id) {
// transactions = transactions.filter(tr => String(tr.id) !== String(id));

// localStorage.setItem("transactions", JSON.stringify(transactions));

// renderDashboard();


// }

// function getSummary(data) {
//   let income = 0;
//   let expense = 0;

//   data.forEach(tr => {
//     if (tr.type === "income") income += tr.amount;
//     if (tr.type === "expense") expense += tr.amount;
//   });

//   return {
//     income,
//     expense,
//     balance: income - expense
//   };
// }


// function renderTable(data) {
//   tableBody.innerHTML = "";

//   data.forEach(tr => {
//     const row = document.createElement("tr");

//     row.innerHTML = `
//       <td>${tr.date}</td>
//       <td>${tr.type}</td>
//       <td>${tr.amount}</td>
//       <td>
//         <button class="btn btn-warning btn-sm" onclick="editTransaction('${tr.id}')">
//           Edit
//         </button>
//         <button class="btn btn-danger btn-sm" onclick="deleteTransaction('${tr.id}')">
//           Delete
//         </button>
//       </td>
//     `;

//     tableBody.appendChild(row);
//   });
// }




// function renderDashboard() {
//   const type = filterType.value;
//   const month = filterMonth.value;
  
  
  
//   let data = filterByType(transactions, type);
//   data = filterByMonth(data, month);
  
//   const total = calculateTotal(data);
//   const summary = getSummary(data);
//   incomeEl.textContent = summary.income;  
//   expenseEl.textContent = summary.expense;
//   balanceEl.textContent = summary.income - summary.expense;
//   totalEl.textContent = total;
  
//   renderTable(data);



// }
// // Edit
// let editId = null;

// function editTransaction(id) {
//     const tr = transactions.find( tr => tr.id === id)
//     dateInput.value = tr.date
//     amountInput.value = tr.amount
//     typeInput.value = tr.type

// editId = id
//     addBtn.textContent = "update"

// }
// window.editTransaction = editTransaction;
// function addTransaction(e) {
  


//   const date = dateInput.value;
//   const amount = Number(amountInput.value);
//   const type = typeInput.value;
//   const id =  'tr' + new Date().getTime() + Math.random(16).toString(36).slice(1,1)

// if(!date || !amount || !type ){
//   alert ("Please fill all fields")
//   return
// }

// if(editId){
//     transactions = transactions.map(tr => {
//         if(tr.id === editId){
//         tr.id === editId ? { ... tr , date, amount, type } : tr;
       
//         }
       
//     })
  
//     addBtn.textContent = "Update";
// }else{
// const newTransaction = {
//   id,
//   date,
//   amount,
//   type
// }
// transactions.push (newTransaction)

// localStorage.setItem("transactions", JSON.stringify(transactions))

// dateInput.value = "";
// amountInput.value = "";
// typeInput.value = "income";
// }


// renderDashboard();

// }


mastertraders1000@gmail.com
