export const THEME = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

export const HOST_ADDRESS = "http://localhost:4000";

export const USER_TYPES = Object.freeze({
  ADMIN: "administrator",
  RECEPCIONIST: "recepcja",
  CONSERVATOR: "konserwator",
  INHABITANT: "mieszkaniec",
});

export const COMMON = Object.freeze({
  USER: "user",
});

export const CUSTOM_SERVER_CODE = Object.freeze({
  100: "Nieprawidłowy email.",
  101: "Wszystkie pola muszą być wypełnione.",
  102: "Nieprawidłowy email lub hasło.",
  103: "Nie można znaleźć użytkownika o podanym id.",
  104: "Hasła nie są takie same.",
  105: "Brak tokenu resetowania hasła.",
  106: "Twój współlokator lub ty masz już przypisanego współlokatora",
  107: "Token resetowania hasła wygasł.",
  108: "Wysałałeś już wcześniej prośbę o wspólne zamieszkanie",
  109: "Użytkownik nie ma przypisanego typu użytkownika.",
  110: "Użytkownik nie jest mieszkańcem.",
  111: "Użytkownik nie ma przypisanego emaila.",
  112: "Nie możesz wysłać prośby ze względu na brak wolnych pokoi",
  113: "Nieprawidłowy format emaila.",
  114: "Email jest już zajęty.",
  115: "Wymagany token.",
  116: "Sesja wygasła.",
  117: "Nieprawidłowy token.",
  118: "Nie możesz zaakceptować swoich własnych zaproszeń do mieszkania",
  119: "Nie ma żadnych pokoi w bazie danych",
  120: "Nie ma pokoju o podanym ID",
  121: "Ty lub twój współlokator jesteście już przypisani do pokoju",
  122: "Zadeklarowałeś chęć zamieszkania ze znajomym, lecz ma on już przypisany pokój.",
  123: "Za późno... Nie możesz wybrać tego pokoju ze względu na niewystarczającą liczbę pokoji dla osób ze współlokatorami. Spróbuj wybrać pokój w którym jest tylko jedno wolne miejsce (kolor żółty)",
  124: "Nie możesz wybrać tego pokoju. Zbyt mało miejsc. Być może posiadasz współlokatora lub chcesz być sam/a w pokoju.",
  125: "Nie masz przypisanego pokoju.",
  126: "Twój pokój wykorzytsał już maksylną liczbę godzin.",
  127: "Pokój o podanym ID nie istnieje",
  128: "Nie możesz zarządzać pokojem do którego nie należysz.",
  129: "Typ konta jakim dysponujesz nie może wykonać tej czynności.",
  130: "Ogłoszenie o podanym ID nie istnieje.",
  131: "Nie możesz edytować nieswojego obiektu.",
  132: "Oferta wymiany o podanym ID nie istnije.",
  133: "Usterka o podanym ID nie istnieje.",
  134: "Podany typ usterki nie istnieje.",
  135: "Typ przekazanego parametru jest nieodpowiedni",
  136: "Nieprawidłowy typ przesłanych danych",
  137: "Prośba o odwiedziny z tym ID nie istnieje",
  138: "Prośba o odwiedziny dla tego użytkownika już została wysłana.",
  139: "Nie możesz dodać więcej odwiedzin.",
  140: "Nie można usunąć godzin prania z przeszłości",
  141: "Nie możesz zarezerwować prania w przeszłości",
  142: "Użytkownik z podanym adresem email już istnieje",
  143: "Pracownik z podanym ID nie istnieje lub został już usunięty",
  144: "Mieszkaniec z podanym adetes email już istnieje",
  145: "Mieszkaniec z podanym ID nie istnieje lub został już usunięty",
});
