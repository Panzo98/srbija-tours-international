export const getCountry = (city) => {
  const cityCountryMap = {
    "Preševo": "Srbija",
    "Bujanovac": "Srbija",
    "Vranje": "Srbija",
    "Vladičin Han": "Srbija",
    "Leskovac": "Srbija",
    "Niš": "Srbija",
    "Aleksinac": "Srbija",
    "Kruševac": "Srbija",
    "Varvarin": "Srbija",
    "Paraćin": "Srbija",
    "Ćuprija": "Srbija",
    "Jagodina": "Srbija",
    "Velika Plana": "Srbija",
    "Požarevac": "Srbija",
    "Požarevac ( Petlja )": "Srbija",
    "Beograd": "Srbija",
    "Ruma": "Srbija",
    "Novi Sad": "Srbija",
    "Subotica": "Srbija",
    "Rosenheim": "Nemačka",
    "Holzkirchen": "Nemačka",
    "Landsberg A.l.": "Nemačka",
    "Memingen": "Nemačka",
    "Ravensburg": "Nemačka",
    "Lindau": "Nemačka",
    "Munchen": "Nemačka",
    "Augsburg": "Nemačka",
    "Ulm": "Nemačka",
    "Stutgart": "Nemačka",
    "Dresden": "Nemačka",
    "Berlin": "Nemačka",
    "Hamburg": "Nemačka",
    "Bremen": "Nemačka",
    "Regensburg": "Nemačka",
    "Nürnberg": "Nemačka",
    "Bamberg": "Nemačka",
    "Schweinfurt": "Nemačka",
    "Mannheim": "Nemačka",
    "Frankfurt": "Nemačka",
    "Köln": "Nemačka",
    "Düsseldorf": "Nemačka",
    "Duisburg": "Nemačka",
    "Essen": "Nemačka",
    "Trst": "Italija",
    "Udine": "Italija",
    "Padova": "Italija",
    "Vićenca": "Italija",
    "Paderborn": "Nemačka",
    "Fulda": "Nemačka",
    "Kassel": "Nemačka",
    "Bielefeld": "Nemačka",
    "Hannover": "Nemačka",
    "Friedrichshafen": "Nemačka",
    "Würzburg": "Nemačka"
  };
  return cityCountryMap[city] || "Nepoznata država";
};

