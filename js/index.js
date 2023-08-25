document.addEventListener("DOMContentLoaded", function() {

    const listArea = document.querySelector ('#list');
    const showPanel = document.querySelector ('#show-panel');

    function renderBooks (arrOfBooks) {
        arrOfBooks.forEach(element => {
            const li = document.createElement ('li');
            li.textContent = element.title;
            li.id = element.id; li.classList.add ('book-name')
            document.querySelector ('#list').append (li)
        });
    }

    function renderBookDetail (bookData) {
        const bookImg = document.createElement ('img');
        bookImg.src = bookData.img_url;
        const title = document.createElement ('h3');
        title.textContent = bookData.title;
        const subtitle = document.createElement ('h4');
        subtitle.textContent = bookData.subtitle;
        const author = document.createElement ('h4');
        author.textContent = bookData.author;
        const description = document.createElement ('p');
        description.textContent = bookData.description;
        const listOfUsersLiking = document.createElement ('ul');
        console.log (bookData.users)
        for (const user of bookData.users) {
            const li = document.createElement ('li');
            li.textContent = user.username; 
            li.classList.add('likes-list'); 
            li.id = user.id
            listOfUsersLiking.append(li);
        }
        const likeButton = document.createElement ('button');
        likeButton.textContent = 'LIKE'; likeButton.id = bookData.id;
        likeButton.classList.add ('like-button');
        const space = document.createElement ('br');
        const space1 = document.createElement ('br');
        showPanel.append (bookImg, title, subtitle, author,
             description, listOfUsersLiking, likeButton, space, space1)
    }

    async function updateLikeStatus (id, usersKeyValue) {
        const resPro = await fetch (`http://localhost:3000/books/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify (usersKeyValue)
        })
        const dataPro = await resPro.json();
        return dataPro;
    }

    async function getAllBookObjects () {
        const resPro = await fetch ('http://localhost:3000/books');
        const dataPro = await resPro.json();
        return dataPro;
    }

    async function getBookDetail (id) {
        const resPro = await fetch (`http://localhost:3000/books/${id}`);
        const dataPro = await resPro.json();
        return dataPro;
    }

    async function deleteLikeData (id) {
        const resPro = await fetch (`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: null
        });
        const dataPro = await resPro.json();
        return dataPro;
    }
    

    getAllBookObjects().then (data => renderBooks(data))

    listArea.addEventListener ('click', event => {
        if (event.target.className === 'book-name') {
            const idToGet = event.target.id;
            getBookDetail (idToGet).then (data => renderBookDetail (data))
        }
    })

    document.addEventListener ('click', event => {
        if ((event.target.classList)[0] === 'like-button') {
           if (event.target.textContent === 'LIKE') { const arr = []
            for (const item of Array.from(document.querySelectorAll('.likes-list'))) {
                arr.push({id: parseInt(item.id, 10), username: item.textContent})
            }
            updateLikeStatus (event.target.id, {users: [...arr, {id: 89, username: 'owen'}]})
            .then (data => renderBookDetail(data))
            event.target.textContent = 'UNLIKE';
           }
           else {
            deleteLikeData(8) .then (data => renderBookDetail(data));
            event.target.textContent = 'LIKE';
           }
        }
    })
});
