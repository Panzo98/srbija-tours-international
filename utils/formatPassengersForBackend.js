export const formatPassengersForBackend = (passengers) => {
  return passengers.map(
    ({ category, name, lastName, phone, birthday, price }) => ({
      category,
      name,
      lastName,
      phone,
      birthday,
      price,
    })
  );
};
