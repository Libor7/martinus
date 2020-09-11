<?php 

$csv_file = 'books.csv';
$xml_file = 'books.xml';
$handle = fopen($csv_file, 'r');

$xml_doc = new DOMDocument('1.0', 'utf-8');
$books = $xml_doc->createElement('books');
$xml_doc->appendChild($books);

if ($handle) {
  while (($line = fgets($handle)) !== false) {
    $line_begin = substr($line, 0, 7);
    $string_match = preg_match('/^\"{1}[0-9]{6}$/', $line_begin);

    if ($string_match == 1) {
      $line_items = explode(';', $line);
      if (count($line_items) == 8) {
        $book = $xml_doc->createElement('book');
        $books->appendChild($book);

        $item_id = $xml_doc->createElement('item_id');
        $item_id->nodeValue = str_replace('"', '', $line_items[0]);
        $book->appendChild($item_id);

        $title = $xml_doc->createElement('title');
        $title->nodeValue = htmlspecialchars(str_replace('"', '', $line_items[1]));
        $book->appendChild($title);

        $author = $xml_doc->createElement('author');
        $author->nodeValue = htmlspecialchars(str_replace('"', '', $line_items[2]));
        $book->appendChild($author);

        $publisher = $xml_doc->createElement('publisher');
        $publisher->nodeValue = htmlspecialchars(str_replace('"', '', $line_items[3]));
        $book->appendChild($publisher);

        $year = $xml_doc->createElement('year');
        $year->nodeValue = htmlspecialchars(str_replace('"', '', $line_items[4]));
        $book->appendChild($year);

        $img_url = $xml_doc->createElement('img_url');
        $img_url->nodeValue = htmlspecialchars(str_replace('"', '', $line_items[5]));
        $book->appendChild($img_url);

        $description = $xml_doc->createElement('description');
        $description->nodeValue = htmlspecialchars(str_replace('"', '', $line_items[7]));
        $book->appendChild($description);
      }
    }
  }

  $xml_doc->save($xml_file);
  fclose($handle);
}