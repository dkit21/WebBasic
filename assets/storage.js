const CACHE_KEY ="game_history";

function checkStorage() {
	return typeof(Storage) !== "undefined";
}

function putHistory(data) {
	if (checkStorage()) {
		let historyData = null;
		if (localStorage.getItem(CACHE_KEY) === null) {
			historyData = [];
		}
		else {
			historyData = JSON.parse(localStorage.getItem(CACHE_KEY));
		}

		historyData.unshift(data);

		if (historyData.length > 5) {
			historyData.pop();
		}

		localStorage.setItem(CACHE_KEY, JSON.stringify(historyData));
	}
}

function showHistory() {
	if (checkStorage()) {
		return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
	}
	else {
		return [];
	}
}

function renderHistory() {
	const historyData = showHistory();
	let historyList = document.getElementById("historyList");

	// pastikan setiap get historyList dihapus datanya agar tidak ada data double
	historyList.innerHTML = "";

	for (let history of historyData) {
		let row = document.createElement('tr');
		row.innerHTML = '<td>' + history.p1win + '</td>';
		row.innerHTML += '<td>' + history.score + '</td>';
		row.innerHTML += '<td>' + history.p2win + '</td>';

		historyList.appendChild(row);
	} 
}

// panggil fungsi renderHistory(); agar data history muncul ketika website pertama kali dijalankan.
renderHistory(); 