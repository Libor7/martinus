var inputFields = document.getElementsByClassName('christmas_query');
var hints = document.getElementById('christmas_hints');
var xhr = new XMLHttpRequest();
var data = [];

function getBooks(callback) {
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = processXML(this.responseXML);
      callback(result);
    }
  };
  xhr.open('GET', './books.xml');
  xhr.send();
}

function processXML(xml) {
  var books = xml.getElementsByTagName('book');
  for (var i = 0; i < books.length; i++) {
    var temporaryObj = {};
    temporaryObj.id = books[i].getElementsByTagName('item_id')[0].childNodes[0].nodeValue;
    temporaryObj.title = books[i].getElementsByTagName('title')[0].childNodes[0].nodeValue;
    temporaryObj.author = typeof books[i].getElementsByTagName('author')[0].childNodes[0] == 'undefined' ? 'neznámy' : books[i].getElementsByTagName('author')[0].childNodes[0].nodeValue;
    temporaryObj.img = books[i].getElementsByTagName('img_url')[0].childNodes[0].nodeValue;
    temporaryObj.description = books[i].getElementsByTagName('description')[0].childNodes[0].nodeValue;
    data.push(temporaryObj);
  }
  return data;
}

function filterBooks(books, activeField) {
  var author = document.querySelector('input[name=author]').value;
  var title = document.querySelector('input[name=title]').value;
  var description = document.querySelector('input[name=description]').value;

  if (author.length > 1 || title.length > 1 || description.length > 1) {
    books = books.filter(function(book) {
      return book[activeField].toLowerCase().indexOf(eval(activeField).toLowerCase()) !== -1;
    });
    return books;
  }
}

function getRandomInteger(books) {
    var max = books.length - 1;
    return Math.floor(Math.random() * (max + 1));
}

function getHints(books) {
  if (typeof books != 'undefined') {
    var i = 0;
    var chosenBooks = [];
    var length = books.length < 3 ? books.length : 3;

    while (i < length) {
      var bookHint = books[getRandomInteger(books)];
      var found = chosenBooks.find(function(book) {
        return book.id == bookHint.id;
      });

      if (typeof found === 'undefined') {
        chosenBooks.push(bookHint);
        i++;
      }
    }
    return chosenBooks;
  }
}

function createCards(books) {
  if (typeof books != 'undefined') {
    if (books.length != 0) {
      var code = '<div class="card bg-secondary">';
      for (var i = 0; i < books.length; i++) {console.log(books);
        code += '<div class="card__content"><h3>' + books[i].title + '</h3><img src="' + books[i].img + '" alt="Titulná stránka knihy" /><h4>' + books[i].author + '</h4><p>' + books[i].description + '</p></div>';
      }
      code += '</div>';
      return code;
    } else {
      return null;
    }
  }
}

function displayCards(cards) {
  if (typeof cards == 'undefined' || cards == null) {
    hints.innerHTML = '<h2 class="not-found description text">Hľadanému výrazu nevyhovuje žiadna položka tovaru, skúste prosím iný výraz, prípadne Vami zadaný text skráťte.</h2>';
  } else {
    hints.innerHTML = cards;
  }
}

window.onload = function() {
  getBooks(function(result) {
    for (var i = 0; i < inputFields.length; i++) {
      inputFields[i].addEventListener('input', function() {
        var books = filterBooks(result, document.activeElement.name);
        var chosenBooks = getHints(books);
        var cards = createCards(chosenBooks);
        displayCards(cards);
      });
    }

    for (var i = 0; i < inputFields.length; i++) {
      inputFields[i].addEventListener('blur', function() {
        this.value = '';
      });
    }
  });
}
