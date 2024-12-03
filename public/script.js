async function searchEmployees() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
      document.getElementById('results').innerHTML = '';
      return;
    }
    
    const response = await fetch(`http://localhost:5000/search?query=${query}`);
    const employees = await response.json();
  
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = employees.map(emp => `
      <div class="employee">
        <h3>${emp.first_name} ${emp.last_name}</h3>
        <p><strong>Phone:</strong> ${emp.phone_number}</p>
        <p><strong>FIN Code:</strong> ${emp.fin_code}</p>
        <p><strong>Email:</strong> ${emp.email}</p>
      </div>
    `).join('');
  }
  