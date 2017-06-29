
let Socket = new LispSocket(HTTP_URI, LS_URI, FILE_PATH, TOKEN);

window.onload = () => {
  let container = document.getElementById('dm-container');
  let renderer = new Renderer();
  let lispRenderer = new LispRenderer(Socket);
  let mdRenderer = new MDRenderer();
  mdRenderer.attachLispRenderer(lispRenderer);
  renderer.registRenderMethod('lisp', lispRenderer);
  renderer.registRenderMethod('md', mdRenderer);
  fetchKeyBind('keybind');
  window.addEventListener('keydown', HandlingKeyBind, true);
  initCells(renderer);
  appendLastCell(renderer, container);
  attachCloseFunction();

}

function initCells(renderer) {
  let elements = document.getElementsByClassName('cell');
  let prev = null;
  for (let i = 0; i < elements.length; i++) {
    let cell = elements[i];
    let instance = Cell.fromElement(cell);
    instance.attachRenderer(renderer);
    if (prev && instance.prev === '') {
      instance.element.dataset.prev = prev.id;
    }
    if (instance.next === '' && i < elements.length-1) {
      instance.element.dataset.next = elements[i+1].id;
    }
    Cells[cell.id] = instance;
    prev = instance;
  }
}

function appendLastCell(renderer, container) {
  let elements = document.getElementsByClassName('cell');
  if (elements.length > 0) {
    let lastcell = Cells[elements[elements.length-1].id];
    if (lastcell.sources.lisp.innerHTML !== ''
     || lastcell.sources.md.innerHTML !== ''
     || lastcell.output.innerHTML !== '') {
      let instance = Cell.createElement(Date.now().toString());
      instance.attachRenderer(renderer);
      lastcell.element.dataset.next = instance.id;
      instance.element.dataset.prev = lastcell.id;
      container.appendChild(instance.element);
    }
  } else {
    let instance = Cell.createElement(Date.now().toString());
    instance.attachRenderer(renderer);
    container.appendChild(instance.element);
  }
}
