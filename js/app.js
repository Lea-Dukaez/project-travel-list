const addList = document.querySelector('.add-list');
const containerList = document.querySelector('.container-list');


// // get document from datbase
// db.collection('category').get().then((snapshot) => {
//   snapshot.docs.forEach(doc => {
//     showCategory(doc.data(), doc.id);
//   });
// }).catch(err => {
//   console.log(err);
// });

const deleteCategory = (id) => {
  const categories = document.querySelectorAll('section');
  categories.forEach(category => {
    if(category.getAttribute('data-id') ===  id){
      category.remove();
    }
  });

}


db.collection('category').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if(change.type === 'added'){
      showCategory(doc.data(), doc.id);
    } else if (change.type === 'remove'){
      deleteCategory(doc.id);
    }
  });
});

// add a category
addList.addEventListener('submit', e => {
  e.preventDefault();

  const newList = e.target.firstElementChild.value.trim();
  if (newList){
    const categorydoc = {
      title: newList,
      items: []
    };

    db.collection('category').add(categorydoc).then(() => {
      console.log("category added");
    }).catch(err => console.log("error adding document: ", err));
  }
  e.target.reset();
});

// add a item in a category
containerList.addEventListener('submit', e => {
  e.preventDefault();

  const newItem = e.target.firstElementChild.value.trim();
  const categoryTitle = e.target.previousElementSibling.innerHTML;

  if (newItem){
    const categoryRef = db.collection('category').doc('categoryTitle');
    // Atomically add a new item to the "items" array field in database.
    categoryRef.update({
      items: firebase.firestore.FieldValue.arrayUnion(newItem)
    });
  }
  e.target.reset();

});

// icon fonctionality // deleting data
containerList.addEventListener('click', e => {

  if(e.target.className === 'fas fa-times'){
    const item = e.target.parentNode.firstChild.innerHTML;
    const categoryTitle = e.target.parentNode.parentNode.previousElementSibling.previousElementSibling.innerHTML;
    const categoryRef = db.collection('category').doc('categoryTitle');
    // Atomically remove an item from the "items" array field in database.
    categoryRef.update({
      items: firebase.firestore.FieldValue.arrayRemove(item)
    });
  } else if(e.target.className === 'fas fa-check'){
    const item = e.target;
    item.style.color = '#40E0D0';
  } else if(e.target.className === 'far fa-trash-alt trash'){
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection("category").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch(err => {
      console.error("Error removing document: ", error);
  });
  
  }
});


const showCategory = (category, id) => {
  let items_list = "";
  category.items.forEach(item =>{
    const item_html = `
        <li><span>${item}</span><i class="fas fa-times"></i><i class="fas fa-check"></i></li>
    `;
    items_list += item_html
  });

  const list_html = `
    <section class="list" data-id="${id}">
      <i class="far fa-trash-alt trash"></i>
      <h2>${category.title}</h2>
      <form class="add-item">
        <input type="text" placeholder="add">
      </form>
      <ul>
      ${items_list}
      </ul>
    </section>
  `;
  containerList.innerHTML += list_html;
};



