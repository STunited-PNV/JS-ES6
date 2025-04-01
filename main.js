const tasks = [];
let checkbelling = true;

const isValidTask = (text, time, excludeIndex = -1) => {
    if (!text || !time) {
        alert("Không được để rỗng 1 trong 2 ô input");
        return false;
    }

    if (text.length > 20) {
        alert("Name task không được lớn hơn 20 ký tự");
        return false;
    }

    if (tasks.some((task, index) => index !== excludeIndex && task.time === time)) {
        alert("Đã có một công việc vào giờ này.");
        return false;
    }

    return true;
};

const addTask = () => {
    const taskText = document.getElementById("task").value;
    const taskTime = document.getElementById("time").value;
    if (!isValidTask(taskText, taskTime)) return;
    
    tasks.push({ text: taskText, time: taskTime, notify: true, notifyStatus: false });
    renderTasks();
    document.getElementById("task").value = "";
    document.getElementById("time").value = "";
};

const renderTasks = () => {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    tasks.forEach((task, index) => {
        const daytime = formatDateTime(task.time);
        const li = document.createElement("li");
        li.className = "todo-item";
        li.innerHTML = `
            <span class="todo-text">${task.text} - ${daytime}</span>
            <button class="todo-btn btn-edit" onclick="editTask(${index})">✏️</button>
            <button class="todo-btn btn-delete" onclick="deleteTask(${index})">❌</button>
            <button class="todo-btn btn-bell" onclick="toggleReminder(${index})">${task.notify ? '🔔' : '🔕'}</button>
        `;
        list.appendChild(li);
    });
};

const toggleReminder = index => {
    tasks[index].notify = !tasks[index].notify;
    renderTasks();
};

const editTask = index => {
    const task = tasks[index];
    document.getElementById("editTask").value = task.text;
    document.getElementById("editTime").value = task.time;
    document.getElementById("editOverlay").style.display = "flex";
    document.getElementById("editOverlay").dataset.taskIndex = index;
};

const updateTask = () => {
    const taskIndex = document.getElementById("editOverlay").dataset.taskIndex;
    const newText = document.getElementById("editTask").value;
    const newTime = document.getElementById("editTime").value;
    
    if (!isValidTask(newText, newTime)) return;
    
    if (newText && newTime) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].time = newTime;
        renderTasks();
        cancelEdit();
    }
};

const cancelEdit = () => {
    document.getElementById("editOverlay").style.display = "none";
    document.getElementById("editTask").value = "";
    document.getElementById("editTime").value = "";
};

const deleteTask = index => {
    tasks.splice(index, 1);
    renderTasks();
};

const checkReminders = () => {
    const nowISO = new Date().toISOString().slice(0, 16);

    tasks.forEach(task => {
        const taskTime = new Date(task.time).toISOString().slice(0, 16);
        if (!task.notifyStatus && checkbelling && task.notify && taskTime === nowISO) {
            const alarm = document.getElementById("alarm");
            alarm.volume = 1.0;
            alarm.play().catch(e => console.log("Lỗi phát âm thanh:", e));
            task.notifyStatus = true;
            stopBell();
            setTimeout(() => task.notifyStatus = false, 30000);
        }
    });
};

const stopBell = () => {
    alert("Chuông sẽ dừng lại sau khi bạn nhấn OK.");
    setTimeout(() => {
        const alarm = document.getElementById("alarm");
        alarm.pause();
        alarm.currentTime = 0;
        checkbelling = true;
    }, 100);
};

const formatDateTime = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

setInterval(checkReminders, 1000);
