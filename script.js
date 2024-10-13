const add_btn = document.getElementById('add-doc-btn');
const delete_btn = document.getElementById('delete-doc-btn');
const doc_container = document.getElementById('docs');

let docs = JSON.parse(localStorage.getItem('docs')) || [];

//show docbox
function RenderBox() {
  doc_container.innerHTML = ''; 

  docs.forEach((doc, index) => {
    const docBox = document.createElement('div');
    docBox.className = 'doc-box';

    const headingElem = document.createElement('div');
    headingElem.className = 'doc-heading';
    headingElem.textContent = `Filename : ${doc.heading}`;

    const writerElem = document.createElement('div');
    writerElem.className = 'doc-writer';
    writerElem.textContent = `Written by ${doc.writer}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'doc-delete-btn';
    deleteBtn.style.display = 'none'; 
    deleteBtn.onclick = (event) => {
      event.stopPropagation();
      deleteDoc(index);
    };

    docBox.appendChild(headingElem);
    docBox.appendChild(writerElem);
    docBox.appendChild(deleteBtn);
    docBox.onclick = () => Opendoc(index);

    doc_container.appendChild(docBox);
  });
}

//delete docbox
function deleteDoc(index) {
  docs.splice(index, 1);
  localStorage.setItem('docs', JSON.stringify(docs));
  RenderBox();
}

//open newdoc
function Opendoc(index) {
  const doc = docs[index];
  const newWindow = window.open('', '_blink');

  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="docstyles.css">
      <title>${doc.heading || `Untitled ${index + 1}`}</title>
      <link rel="shortcut icon" href="file_icon.png" type="image/x-icon">
    </head>
    <body>
      <button id="home" onclick="document.location='index.html'">Home</button>
      <input id="heading-input" placeholder="Heading. . ." value="${doc.heading || `Untitled ${index+1}`}">
      <input id="writer-input" placeholder="Written by. . ." value="${doc.writer || ''}">
      <textarea id="content-input" placeholder="Type your content here...">${doc.content || ''}</textarea>
      <button id="save-btn">Save</button>

      <script>
        document.getElementById('save-btn').onclick = function() {
          const newHeading = document.getElementById('heading-input').value;
          const newWriter = document.getElementById('writer-input').value;
          const newContent = document.getElementById('content-input').value;

          window.opener.updateDoc(${index}, newHeading, newWriter, newContent);
        };
      </script>
    </body>
    </html>
  `);
}

//update files
window.updateDoc = function (index, newHeading, newWriter, newContent) {
  docs[index].heading = newHeading;
  docs[index].writer = newWriter;
  docs[index].content = newContent;

  localStorage.setItem('docs', JSON.stringify(docs));
  RenderBox();
};

//create newdoc
function createDoc() {
  const newDoc = {
    heading: '',
    writer: '',
    content: '',
  };
  docs.push(newDoc);
  localStorage.setItem('docs', JSON.stringify(docs));
  RenderBox();
  Opendoc(docs.length-1);
}

//add button
add_btn.addEventListener('click', createDoc);

//delete button
delete_btn.addEventListener('click', () => {
  const deleteButtons = document.querySelectorAll('.doc-delete-btn');
  deleteButtons.forEach((btn) => {
    btn.style.display = btn.style.display === 'block' ? 'none' : 'block'; // สลับการแสดง/ซ่อน
  });
});


RenderBox();
