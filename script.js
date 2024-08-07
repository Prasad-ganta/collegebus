let adminPassword = localStorage.getItem('adminPassword') || "admin123";
let buses = JSON.parse(localStorage.getItem('buses')) || {};

function adminLogin() {
    const enteredPassword = document.getElementById('adminPassword').value;
    if (enteredPassword === adminPassword) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';
    } else {
        alert("Incorrect password!");
    }
}

function saveData() {
    localStorage.setItem('buses', JSON.stringify(buses));
    localStorage.setItem('adminPassword', adminPassword);
}

function displayBusDetails() {
    const busName = document.getElementById('busInput').value.trim();
    const busDetails = document.getElementById('busDetails');

    if (buses[busName]) {
        let html = `<h2>Details for ${busName}</h2>`;
        buses[busName].forEach(student => {
            html += `
                <div>
                    <p><strong>Student ID:</strong> ${student.id}</p>
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Department:</strong> ${student.department}</p>
                    <p><strong>Year of Study:</strong> ${student.year}</p>
                    <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                    <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                    <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                    <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                    <input type="number" id="feesPaid_${student.id}" placeholder="Enter Fees Paid" />
                    <button onclick="updateFeesPaid('${busName}', '${student.id}')">Update Fees</button>
                    <button onclick="grantPermission('${busName}', '${student.id}')">Grant Permission</button>
                    <button onclick="deleteStudent('${busName}', '${student.id}')">Delete Student</button>
                    <hr>
                </div>`;
        });
        busDetails.innerHTML = html;
    } else {
        busDetails.innerHTML = `<p class="alert">No details found for ${busName}</p>`;
    }
}

function updateFeesPaid(busName, studentId) {
    const feesPaidInput = document.getElementById(`feesPaid_${studentId}`).value.trim();
    const feesPaidAmount = parseFloat(feesPaidInput);

    if (!isNaN(feesPaidAmount)) {
        buses[busName].forEach(student => {
            if (student.id === studentId) {
                student.feesPaid += feesPaidAmount;
                student.permissionGranted = student.feesPaid >= student.feesTotal;
                alert(`Fees updated for student ${student.name} (${studentId})`);
            }
        });
        saveData();
        displayBusDetails(); // Refresh the display
    } else {
        alert("Invalid fees amount.");
    }
}

function grantPermission(busName, studentId) {
    buses[busName].forEach(student => {
        if (student.id === studentId) {
            student.permissionGranted = true;
            alert(`Permission granted for student ${student.name} (${studentId})`);
        }
    });
    saveData();
    displayBusDetails(); // Refresh the display
}

function deleteStudent(busName, studentId) {
    buses[busName] = buses[busName].filter(student => student.id !== studentId);
    alert(`Student with ID ${studentId} deleted.`);
    saveData();
    displayBusDetails(); // Refresh the display
}

function showAddBusForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'block';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
}

function showAddStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addStudentForm').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
}

function showChangePasswordForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('changePasswordForm').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
}

function showSearchStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('searchStudentForm').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
}

function addBus() {
    const busName = document.getElementById('newBusName').value.trim();
    if (busName && !buses[busName]) {
        buses[busName] = [];
        saveData();
        alert(`Bus ${busName} added successfully.`);
        document.getElementById('newBusName').value = '';
    } else {
        alert("Bus name is invalid or already exists.");
    }
}

function addStudent() {
    const busName = document.getElementById('studentBusName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentDepartment = document.getElementById('studentDepartment').value.trim();
    const studentYear = document.getElementById('studentYear').value.trim();
    const feesTotal = parseFloat(document.getElementById('feesTotal').value.trim());
    const feesPaid = parseFloat(document.getElementById('feesPaid').value.trim());

    if (busName && studentId && studentName && studentDepartment && studentYear && !isNaN(feesTotal) && !isNaN(feesPaid)) {
        if (!buses[busName]) {
            alert(`Bus ${busName} does not exist.`);
            return;
        }
        buses[busName].push({
            id: studentId,
            name: studentName,
            department: studentDepartment,
            year: studentYear,
            feesTotal: feesTotal,
            feesPaid: feesPaid,
            permissionGranted: feesPaid >= feesTotal
        });
        saveData();
        alert(`Student ${studentName} added successfully.`);
        document.getElementById('studentBusName').value = '';
        document.getElementById('studentId').value = '';
        document.getElementById('studentName').value = '';
        document.getElementById('studentDepartment').value = '';
        document.getElementById('studentYear').value = '';
        document.getElementById('feesTotal').value = '';
        document.getElementById('feesPaid').value = '';
    } else {
        alert("Please fill all the fields correctly.");
    }
}

function changeAdminPassword() {
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (currentPassword === adminPassword && newPassword) {
        adminPassword = newPassword;
        saveData();
        alert("Password changed successfully.");
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
    } else {
        alert("Current password is incorrect or new password is invalid.");
    }
}

function searchStudent() {
    const studentId = document.getElementById('searchStudentId').value.trim();
    const searchResult = document.getElementById('searchResult');
    let found = false;

    for (let bus in buses) {
        buses[bus].forEach(student => {
            if (student.id === studentId) {
                searchResult.innerHTML = `
                    <h2>Search Result</h2>
                    <div>
                        <p><strong>Bus Name:</strong> ${bus}</p>
                        <p><strong>Student ID:</strong> ${student.id}</p>
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Department:</strong> ${student.department}</p>
                        <p><strong>Year of Study:</strong> ${student.year}</p>
                        <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                        <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                        <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                        <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                    </div>`;
                found = true;
            }
        });
    }

    if (!found) {
        searchResult.innerHTML = `<p class="alert">No student found with ID ${studentId}</p>`;
    }
}
