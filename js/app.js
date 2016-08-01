function parseFile() {
    let structure;
    document.getElementById('delete').style.display = 'none';
    if (localStorage.getItem('tree')) {
        structure = JSON.parse(localStorage.getItem('tree'));
    }
    else {
        const file = new XMLHttpRequest();
        file.open('GET', 'files.json', false);
        file.send();
        structure = JSON.parse(file.response);
        localStorage.setItem('tree', JSON.stringify(structure));
    }
    const head = document.getElementById('parseResult');
    head.innerHTML = '';
    initParse(structure, head);
    expanding();
}
function initParse(fileToParse, placeToAppend) {
    for (let i = 0; i < fileToParse.length; i++) {
        if (fileToParse[i].type == 'folder') {
            const text = document.createTextNode('Folder: ' + fileToParse[i].name);
            const ul = document.createElement('ul');
            text.className = 'directory';
            ul.appendChild(text);
            ul.className = 'folder';
            placeToAppend.appendChild(ul);
            if (fileToParse[i].children) {
                initParse(fileToParse[i].children, ul);
            }
        }
        else {
            const span = document.createElement('li');
            const t = document.createTextNode(fileToParse[i].name);
            span.appendChild(t);
            span.className = 'file';
            placeToAppend.appendChild(span);
        }
    }
}
function rebuildRemoving(fileToParse, placeToAppend) {
    for (let i = 0; i < fileToParse.length; i++) {
        if (fileToParse[i].type == 'folder') {
            const ul = document.createElement('div');
            const t = document.createTextNode(fileToParse[i].name);
            const b = document.createElement('input');
            b.type = 'checkbox';
            b.name = fileToParse[i].name;
            ul.appendChild(b);
            ul.appendChild(t);
            placeToAppend.appendChild(ul);
            if (fileToParse[i].children) {
                rebuildRemoving(fileToParse[i].children, placeToAppend);
            }
        }
        else {
            const span = document.createElement('div');
            const t = document.createTextNode(fileToParse[i].name);
            const b = document.createElement('input');
            b.type = 'checkbox';
            b.name = fileToParse[i].name;
            span.appendChild(b);
            span.appendChild(t);
            placeToAppend.appendChild(span);
        }
    }

}

function expanding() {
    const nodes = document.querySelectorAll('ul.folder');
    nodes[0].addEventListener('click', function (event) {
        for (let i = 0; i < event.target.children.length; i++) {
            event.target.children[i].classList.toggle('expandable');
        }
    });
}

function deleting(file, comparisonAttribute) {
    for (let i = 0; i < file.length; i++) {
        if (file[i].name == comparisonAttribute) {
            file.splice(i, 1);
        }
        else if (file[i].children) {
            deleting(file[i].children, comparisonAttribute);
        }
    }
}
function deleteItems() {
    const checkboxes = document.querySelectorAll('#parseResult input');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const file = JSON.parse(localStorage.getItem('tree'));
            deleting(file, checkboxes[i].name);
            localStorage.setItem('tree', JSON.stringify(file));
        }
    }
    removeItem();
}
function removeItem() {
    const start = document.getElementById('parseResult');
    start.innerHTML = '';
    const file = JSON.parse(localStorage.getItem('tree'));
    rebuildRemoving(file, start);
    document.getElementById('delete').style.display = 'block';
}
function createItem() {
    document.getElementById('delete').style.display = 'none';
    const start = document.getElementById('parseResult');
    start.innerHTML = '';
    start.innerHTML = '<form id="form"><input name="name">Name<br>'
        + '<input type="radio" name="type" value="folder">folder<input type="radio" name="type" value="file">file<br>'
        + '<input name="folderName">Folder to insert<br></form><button onclick="addItem()">Add</button>';
}
function addItem() {
    const form = document.getElementById('form');
    const file = {
        name: form.name.value,
        type: form.type.value
    };
    const folder = form.folderName.value;
    const source = JSON.parse(localStorage.getItem('tree'));
    adding(file, folder, source);
    localStorage.setItem('tree', JSON.stringify(source));
    parseFile();
}
function adding(file, folder, sourceFile) {
    for (let i = 0; i < sourceFile.length; i++) {
        if (sourceFile[i].name == folder) {
            sourceFile[i].children.push(file);
        } else if (sourceFile[i].children) {
            adding(file, folder, sourceFile[i].children);
        }
    }
}
