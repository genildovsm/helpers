const box = document.querySelector('#box');

const cb = (entries, observer) => {
  console.info(entries);
}

const observer = new ResizeObserver(cb);

observer.observe(box, { box: 'border-box' });
