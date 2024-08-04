const allCities = [
  { key: 1, value: "Preševo", country: "Serbia" },
  { key: 2, value: "Bujanovac", country: "Serbia" },
  { key: 3, value: "Vranje", country: "Serbia" },
  { key: 4, value: "Vladičin Han", country: "Serbia" },
  { key: 5, value: "Leskovac", country: "Serbia" },
  { key: 6, value: "Niš", country: "Serbia" },
  { key: 7, value: "Aleksinac", country: "Serbia" },
  { key: 8, value: "Kruševac", country: "Serbia" },
  { key: 9, value: "Varvarin", country: "Serbia" },
  { key: 10, value: "Paraćin", country: "Serbia" },
  { key: 11, value: "Ćuprija", country: "Serbia" },
  { key: 12, value: "Jagodina", country: "Serbia" },
  { key: 13, value: "Velika Plana", country: "Serbia" },
  { key: 14, value: "Požarevac", country: "Serbia" },
  { key: 15, value: "Požarevac ( Petlja )", country: "Serbia" },
  { key: 16, value: "Beograd", country: "Serbia" },
  { key: 17, value: "Ruma", country: "Serbia" },
  { key: 18, value: "Novi Sad", country: "Serbia" },
  { key: 19, value: "Subotica", country: "Serbia" },
  { key: 20, value: "Rosenheim", country: "Germany" },
  { key: 21, value: "Holzkirchen", country: "Germany" },
  { key: 22, value: "Landsberg A.l.", country: "Germany" },
  { key: 23, value: "Memingen", country: "Germany" },
  { key: 24, value: "Ravensburg", country: "Germany" },
  { key: 25, value: "Lindau", country: "Germany" },
  { key: 26, value: "Munchen", country: "Germany" },
  { key: 27, value: "Augsburg", country: "Germany" },
  { key: 28, value: "Ulm", country: "Germany" },
  { key: 29, value: "Stutgart", country: "Germany" },
  { key: 30, value: "Dresden", country: "Germany" },
  { key: 31, value: "Berlin", country: "Germany" },
  { key: 32, value: "Hamburg", country: "Germany" },
  { key: 33, value: "Bremen", country: "Germany" },
  { key: 34, value: "Regensburg", country: "Germany" },
  { key: 35, value: "Nürnberg", country: "Germany" },
  { key: 36, value: "Bamberg", country: "Germany" },
  { key: 37, value: "Schweinfurt", country: "Germany" },
  { key: 38, value: "Mannheim", country: "Germany" },
  { key: 39, value: "Frankfurt", country: "Germany" },
  { key: 40, value: "Köln", country: "Germany" },
  { key: 41, value: "Düsseldorf", country: "Germany" },
  { key: 42, value: "Duisburg", country: "Germany" },
  { key: 43, value: "Essen", country: "Germany" },
  { key: 44, value: "Trst", country: "Italy" },
  { key: 45, value: "Udine", country: "Italy" },
  { key: 46, value: "Padova", country: "Italy" },
  { key: 47, value: "Vićenca", country: "Italy" },
  { key: 51, value: "Paderborn", country: "Germany" },
  { key: 52, value: "Fulda", country: "Germany" },
  { key: 53, value: "Kassel", country: "Germany" },
  { key: 54, value: "Bielefeld", country: "Germany" },
  { key: 55, value: "Hannover", country: "Germany" },
  { key: 59, value: "Friedrichshafen", country: "Germany" },
  { key: 60, value: "Würzburg", country: "Germany" },
];

const toItalyCities = () => {
  return allCities.filter((c) => c.country === "Italy");
};

const getCitiesByCountry = (cityId) => {
  const city = allCities.find((c) => c.key === cityId);
  if (!city) return [];

  if (city.key === 17 || city.key === 14) {
    return toItalyCities();
  }

  if (city.country === "Serbia") {
    return allCities.filter(
      (c) => c.country === "Germany" || c.country === "Italy"
    );
  }

  if (city.country === "Germany") {
    return allCities.filter((c) => c.country === "Serbia" && c.key !== 17);
  }

  if (city.country === "Italy") {
    return allCities.filter(
      (c) => c.country === "Serbia" && c.key !== 19 && c.key !== 18
    );
  }

  return [];
};

export default allCities;
export { getCitiesByCountry };
