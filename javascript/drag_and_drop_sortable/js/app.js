const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.container');

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', (e) => {
    e.target.classList.add('dragging');
  });

  draggable.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
  });
});

containers.forEach(container => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.target, e.clientY);
    const draggable = document.querySelector('.dragging');

    if (afterElement == null){
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
    
  });
});

function getDragAfterElement(container, y){
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {

    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2

    if (offset < 0 && offset > closest.offset){
      return { offset: offset, element: child }
    } else {
      return closest
    }

  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
