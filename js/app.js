const addList = document.querySelector('.add-list');
const containerList = document.querySelector('.container-list');

// fonction called to display database infos considered as "added documents"
const showCategory = (category, id) => {
  let items_list = "";
  category.items.forEach(item =>{
    const item_html = `
        <li><span>${item}</span><i class="fas fa-times"></i><i class="fas fa-check"></i></li>
    `;
    items_list += item_html
  });
  const list_html = `
    <section class="list" data-id="${id}" style="background-color:${category.color};">
      <i class="fas fa-paint-brush brush-modal"></i>
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

// fonction called to remove from HTML the removed data
const deleteCategory = (id) => {
  const categories = document.querySelectorAll('section');
  categories.forEach(category => {
    if(category.getAttribute('data-id') ===  id){
      category.parentNode.removeChild(category);
    }
  });
}

// fonction called to add in ul HTML the added item
const itemAdded = (item, ulModif) => {
  const item_html = `
      <li><span>${item}</span><i class="fas fa-times"></i><i class="fas fa-check"></i></li>
  `;
  ulModif.innerHTML += item_html;
};

// fonction called to removed from ul HTML the added item
const itemDeleted = (liDeleted) => {
  liDeleted.parentNode.removeChild(liDeleted);
};


// event listener when adding/creating a category
addList.addEventListener('submit', e => {
  e.preventDefault();

  const newList = e.target.firstElementChild.value.trim();
  if (newList){
    const categorydoc = {
      title: newList,
      color: "#bc8f8f",
      items: []
    };
    db.collection('category').add(categorydoc).then(() => {
      console.log("category added");
    }).catch(err => console.log("error adding document: ", err));
  }
  e.target.reset();
});

// event listener when adding an item in a category (in database)
containerList.addEventListener('submit', e => {
  e.preventDefault();

  const newItem = e.target.firstElementChild.value.trim();
  const id = e.target.parentElement.getAttribute('data-id');
  const ulModif = e.target.nextElementSibling;

  if (newItem){
    // Atomically add a new item to the "items" array field in database.
    db.collection('category').doc(id).update({
      items: firebase.firestore.FieldValue.arrayUnion(newItem)
    }).then(() => {
      console.log("item added");
    }).catch(err => console.log("error adding document: ", err));

    itemAdded(newItem, ulModif);
  }

  e.target.reset();
});

let colorCounter = 0;

// event listner for icon fonctionality // when deleting item form the "items array (field) or deleting document from database
containerList.addEventListener('click', e => {

  if(e.target.className === 'fas fa-times'){
    // Atomically remove an item from the "items" array field in database.
    const item = e.target.parentNode.firstChild.innerHTML;
    const id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
    const categoryRef = db.collection('category').doc(id);
    categoryRef.update({
      items: firebase.firestore.FieldValue.arrayRemove(item)
    });
    itemDeleted(e.target.parentNode);
  } else if(e.target.className === 'far fa-trash-alt trash'){
    // Atomically remove a document from collection in database.
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection("category").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch(err => {
      console.log("Error removing document: ", err);
  });
  } else if(e.target.classList.contains("fa-check")){
    // change check icon color
    const item = e.target;
    item.classList.toggle("checked");
  } else if(e.target.classList.contains("brush-modal")){
    // change category background color
    const colorList = ["#00b894", "#00cec9", "#0984e3", "#fdcb6e", "#e17055", "#d63031", "#636e72", "#bc8f8f"];
    const catSelected = e.target.parentElement;
    const id = e.target.parentElement.getAttribute('data-id');
    console.log(e.target.parentElement);
    console.log(id);
    if(colorCounter === colorList.length){
      colorCounter = 0;
      // modif data-base
      db.collection("category").doc(id).update({
        "color": colorList[colorCounter]
      }).then(function() {
        console.log("Document successfully updated!");
      }).catch(err => {
        console.log("Error modifying color: ", err);
      });
      // modif affichage
      catSelected.style.backgroundColor = colorList[colorCounter];
      colorCounter += 1;
    } else{
      // modif data-base
      db.collection("category").doc(id).update({
        "color": colorList[colorCounter]
      }).then(function() {
        console.log("Document successfully updated!");
      }).catch(err => {
        console.log("Error modifying color: ", err);
      });
      // modif affichage
      catSelected.style.backgroundColor = colorList[colorCounter];
      colorCounter += 1;
    }
  } 
});


// real-time listener to get data
db.collection('category').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if(change.type === 'added'){
      showCategory(doc.data(), doc.id);
    } else if (change.type === 'removed'){
      deleteCategory(doc.id);
    }
  });
});

