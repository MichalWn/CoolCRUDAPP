Dokumentacja API - Samochody
## Logowanie

### Generowanie widoku logowania

- **Metoda:** GET
- **Endpoint:** `/login`
- **Opis:** Widok logowania.

### Przesyłanie danych logowania

- **Metoda:** POST
- **Endpoint:** `/login`
- **Opis:** Przesyła dane logowania.
  - `login`
  - `haslo`

## Panel Administratora

### Renderowanie widoku panelu administratora

- **Metoda:** GET
- **Endpoint:** `/admin`
- **Opis:** Widok administratora.

### Wylogowywanie użytkownika

- **Metoda:** GET
- **Endpoint:** `/admin/logout`
- **Opis:** Wylogowuje użytkownika i usuwa sesję cookie.

### Dodawanie nowego użytkownika

- **Metoda:** GET
- **Endpoint:** `/admin/adduser`
- **Opis:** Widok do dodawania nowego użytkownika.

- **Metoda:** POST
- **Endpoint:** `/admin/adduser`
- **Opis:** Dodaje nowego użytkownika do systemu.
  - `login`
  - `haslo`
  - `email`
  - `czyAdmin`
  - `imie`
  - `nazwisko`
  - `telefon`

### Lista Samochodów
Metoda: GET

Endpoint: /cars

Opis: Pobiera listę samochodów z bazy danych. Wyświetla różne widoki w zależności od tego, czy użytkownik jest administratorem.

Zwracane dane:
* title: Tytuł strony.
* username: Nazwa zalogowanego użytkownika.
* data: Tablica z danymi samochodów.
  
Edycja Samochodu

Metoda: POST

Endpoint: /cars/edit/:id

Opis: Aktualizuje informacje o samochodzie o określonym ID w bazie danych. Dostępne tylko dla administratora.

Parametry ścieżki:
* id: ID samochodu do aktualizacji.
Parametry ciała:
* marka: Nowa marka samochodu.
* model: Nowy model samochodu.
* rocznik: Nowy rocznik samochodu.
* cena: Nowa cena samochodu.
  
Usuwanie Samochodu

Metoda: DELETE

Endpoint: /cars/delete/:id

Opis: Usuwa samochód z bazy danych o określonym ID. Dostępne tylko dla administratora.

Parametry ścieżki:
* id: ID samochodu do usunięcia.
