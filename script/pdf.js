const button = document.querySelector('#expand-button');
const container = document.querySelector('#expandingContainer');
const pdfBar = document.querySelector('.pdf-viewer-bar');
const arrowPrevButton = document.querySelector('#prev-page');
const arrowNextButton = document.querySelector('#next-page');

button.addEventListener('click', () => {
  container.classList.toggle('expanded');

  // If the container is expanded, change the icon to the contract icon
  if (container.classList.contains('expanded')) {
    button.innerHTML = '<i class="bi bi-arrows-angle-contract"></i>';
    pdfBar.style.position = "sticky";
    arrowPrevButton.style.position = "fixed";
    arrowNextButton.style.position = "fixed";
  }
  // Otherwise, change the icon to the expand icon
  else {
    button.innerHTML = '<i class="bi bi-arrows-angle-expand"></i>';
    pdfBar.style.position = "sticky";
    arrowPrevButton.style.position = "absolute";
    arrowNextButton.style.position = "absolute";
  }
});

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

const url = sessionStorage.getItem('issue_file');

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

let scale = 5,
canvas = document.querySelector('#pdf-render'),
ctx = canvas.getContext('2d');

let MIN_SCALE = 1;

// Render the page
const renderPage = num => {
pageIsRendering = true;

// Get page
pdfDoc.getPage(num).then(page => {
  // Set scale
  const viewport = page.getViewport({ scale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderCtx = {
    canvasContext: ctx,
    viewport
  };

  page.render(renderCtx).promise.then(() => {
    pageIsRendering = false;

    if (pageNumIsPending !== null) {
      renderPage(pageNumIsPending);
      pageNumIsPending = null;
    }
  });

  // Output current page
  document.querySelector('#page-num').textContent = num;
});
};

// Check for pages rendering
const queueRenderPage = num => {
if (pageIsRendering) {
  pageNumIsPending = num;
} else {
  renderPage(num);
}
};

// Show Prev Page
const showPrevPage = () => {
if (pageNum <= 1) {
  return;
}
pageNum--;
queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
if (pageNum >= pdfDoc.numPages) {
  return;
}
pageNum++;
queueRenderPage(pageNum);
};

// Get Document
pdfjsLib
.getDocument(url)
.promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;

  document.querySelector('#page-count').textContent = pdfDoc.numPages;

  renderPage(pageNum);
})
.catch(err => {
  // Display error
  const div = document.createElement('div');
  div.className = 'error';
  div.appendChild(document.createTextNode(err.message));
  document.querySelector('body').insertBefore(div, canvas);
  // Remove top bar
  document.querySelector('.top-bar').style.display = 'none';
});



// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);


const div = document.querySelector('.inner-most-pdf');

function zoomIn() {
// Increment the scale factor by 0.5 to zoom in on the document

div.style.height = div.offsetHeight + 50 + 'px';

scale += 0.5;
}




function zoomOut() {

div.style.height = div.offsetHeight - 50 + 'px';
// Decrement the scale factor by 0.5 to zoom out on the document
if (scale - 0.5 < MIN_SCALE) {
return;
}
scale -= 0.5;
}
